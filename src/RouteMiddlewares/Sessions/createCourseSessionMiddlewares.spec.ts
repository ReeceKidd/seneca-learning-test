/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createCourseSessionMiddlewares,
    createCourseSessionBodyValidationMiddleware,
    createCourseSessionFromRequestMiddleware,
    getCreateCourseSessionFromRequestMiddleware,
    sendFormattedCourseSessionMiddleware,
    createCourseSessionParamsValidationMiddleware,
    increaseStatsForCourseMiddleware,
    updateAverageForCourseMiddleware,
    getUpdateAverageForCourseMiddleware,
    getIncreaseStatsForCourseMiddleware,
    getRetrieveCourseMiddleware,
    retrieveCourseMiddleware,
} from './createCourseSessionMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('createCourseSessionMiddlewares', () => {
    describe(`createCourseSessionParamsValidationMiddleware`, () => {
        const courseId = '12345678';

        const params = {
            courseId,
        };

        test('valid request passes validation', () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params,
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createCourseSessionParamsValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });
    });
    describe(`createCourseSessionBodyValidationMiddleware`, () => {
        const totalModulesStudied = 1;
        const averageScore = 3;
        const timeStudied = 5;

        const body = {
            totalModulesStudied,
            averageScore,
            timeStudied,
        };

        test('valid request passes validation', () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body,
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            createCourseSessionBodyValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });
    });

    describe('retrieveCourseMiddleware', () => {
        test('sets response.locals.course', async () => {
            expect.assertions(3);
            const lean = jest.fn(() => Promise.resolve(true));
            const findOne = jest.fn(() => ({ lean }));
            const courseModel = {
                findOne,
            };
            const courseId = 'abcd';
            const request: any = { params: { courseId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveCourseMiddleware(courseModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({ _id: courseId });
            expect(response.locals.course).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws GetCourseNoCourseFound when course is not found', async () => {
            expect.assertions(1);
            const lean = jest.fn(() => Promise.resolve(false));
            const findOne = jest.fn(() => ({ lean }));
            const courseModel = {
                findOne,
            };
            const courseId = 'abcd';
            const request: any = { params: { courseId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveCourseMiddleware(courseModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.GetCourseNoCourseFound));
        });

        test('calls next with RetrieveCourseMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const errorMessage = 'error';
            const lean = jest.fn(() => Promise.reject(errorMessage));
            const findOne = jest.fn(() => ({ lean }));
            const courseModel = {
                findOne,
            };
            const courseId = 'abcd';
            const request: any = { params: { courseId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveCourseMiddleware(courseModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveCourseMiddleware, expect.any(Error)));
        });
    });

    describe(`createCourseSessionFromRequestMiddleware`, () => {
        test('sets response.locals.savedCourseSession', async () => {
            expect.assertions(2);

            const save = jest.fn().mockResolvedValue(true);

            const courseModel = jest.fn(() => ({ save }));

            const user = { _id: 'userId' };
            const courseId = 'courseId';
            const sessionId = 'ab1234';
            const totalModulesStudied = 1;
            const averageScore = 3.6789;
            const timeStudied = 5;
            const response: any = { locals: { user } };
            const request: any = {
                params: { courseId },
                body: { sessionId, totalModulesStudied, averageScore, timeStudied },
            };
            const next = jest.fn();

            const middleware = getCreateCourseSessionFromRequestMiddleware(courseModel as any);

            await middleware(request, response, next);

            expect(response.locals.savedCourseSession).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateCourseSessionFromRequestMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateCourseSessionFromRequestMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCourseSessionFromRequestMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`increaseStatsForCourseMiddleware`, () => {
        test('that timeStudied and totalModulesStudied are increased for the course', async () => {
            expect.assertions(2);

            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);

            const courseModel = {
                findByIdAndUpdate,
            };
            const courseId = 'courseId';
            const totalModulesStudied = 1;
            const timeStudied = 20;
            const request: any = {
                params: { courseId },
                body: { totalModulesStudied, timeStudied },
            };
            const response: any = { locals: {} };
            const next = jest.fn();

            const middleware = getIncreaseStatsForCourseMiddleware(courseModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(courseId, { $inc: { totalModulesStudied, timeStudied } });
            expect(next).toBeCalledWith();
        });

        test('calls next with IncreaseStatsForCourseMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getIncreaseStatsForCourseMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.IncreaseStatsForCourseMiddleware, expect.any(Error)));
        });
    });

    describe(`updateAverageForCourseMiddleware`, () => {
        test('if the course averageScore is not defined it sets the averageScore to the request.body.averageScore', async () => {
            expect.assertions(2);

            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);

            const courseModel = {
                findByIdAndUpdate,
            };

            const course = {
                _id: 'courseId',
            };
            const response: any = { locals: { course } };
            const averageScore = 10.767483;
            const request: any = {
                params: {},
                body: { averageScore },
            };
            const next = jest.fn();

            const middleware = getUpdateAverageForCourseMiddleware(courseModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(course._id, { $set: { averageScore: 10.77 } });
            expect(next).toBeCalledWith();
        });

        test('if the course averageScore exists it sets the averageScore to the average of the existing averageScore and the request.body.averageScore', async () => {
            expect.assertions(2);

            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);

            const courseModel = {
                findByIdAndUpdate,
            };

            const course = {
                _id: 'courseId',
                averageScore: 10,
            };
            const response: any = { locals: { course } };
            const averageScore = 10;
            const request: any = {
                params: {},
                body: { averageScore },
            };
            const next = jest.fn();

            const middleware = getUpdateAverageForCourseMiddleware(courseModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(course._id, { $set: { averageScore } });
            expect(next).toBeCalledWith();
        });

        test('if the course averageScore exists and the new average score equals a number to multiple decimal places it rounds the number to two places.', async () => {
            expect.assertions(2);

            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);

            const courseModel = {
                findByIdAndUpdate,
            };

            const course = {
                _id: 'courseId',
                averageScore: 10,
            };
            const response: any = { locals: { course } };
            const averageScore = 3.456667;
            const request: any = {
                params: {},
                body: { averageScore },
            };
            const next = jest.fn();

            const middleware = getUpdateAverageForCourseMiddleware(courseModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(course._id, { $set: { averageScore: 6.73 } });
            expect(next).toBeCalledWith();
        });

        test('calls next with UpdateAverageForCourseMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getUpdateAverageForCourseMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UpdateAverageForCourseMiddleware, expect.any(Error)));
        });
    });

    describe(`sendFormattedCourseSessionMiddleware`, () => {
        test('responds with status 201 with a course session', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));

            const courseId = 'courseId';
            const _id = 'ab1234';
            const totalModulesStudied = 1;
            const averageScore = 3;
            const timeStudied = 5;
            const savedCourseSession = {
                _id,
                courseId,
                totalModulesStudied,
                averageScore,
                timeStudied,
            };
            const response: any = { locals: { savedCourseSession }, status };
            const request: any = {};
            const next = jest.fn();

            sendFormattedCourseSessionMiddleware(request, response, next);

            expect(response.locals.user).toBeUndefined();
            expect(next).toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith({
                sessionId: savedCourseSession._id,
                totalModulesStudied,
                averageScore,
                timeStudied,
            });
        });

        test('calls next with SendFormattedCourseSessionMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            sendFormattedCourseSessionMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendFormattedCourseSessionMiddleware, expect.any(Error)),
            );
        });
    });

    test('that createCourseSession middlewares are defined in the correct order', async () => {
        expect.assertions(8);

        expect(createCourseSessionMiddlewares.length).toEqual(7);
        expect(createCourseSessionMiddlewares[0]).toBe(createCourseSessionParamsValidationMiddleware);
        expect(createCourseSessionMiddlewares[1]).toBe(createCourseSessionBodyValidationMiddleware);
        expect(createCourseSessionMiddlewares[2]).toBe(retrieveCourseMiddleware);
        expect(createCourseSessionMiddlewares[3]).toBe(createCourseSessionFromRequestMiddleware);
        expect(createCourseSessionMiddlewares[4]).toBe(increaseStatsForCourseMiddleware);
        expect(createCourseSessionMiddlewares[5]).toBe(updateAverageForCourseMiddleware);
        expect(createCourseSessionMiddlewares[6]).toBe(sendFormattedCourseSessionMiddleware);
    });
});
