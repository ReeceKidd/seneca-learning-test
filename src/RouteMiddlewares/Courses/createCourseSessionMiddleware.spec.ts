/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createCourseSessionMiddlewares,
    createCourseSessionBodyValidationMiddleware,
    createCourseSessionFromRequestMiddleware,
    getCreateCourseSessionFromRequestMiddleware,
    sendFormattedCourseSessionMiddleware,
    createCourseSessionParamsValidationMiddleware,
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
        const sessionId = 'ab1234';
        const totalModulesStudied = 1;
        const averageScore = 3;
        const timeStudied = 5;

        const body = {
            sessionId,
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

    describe(`createCourseSessionFromRequestMiddleware`, () => {
        test('sets response.locals.savedCourseSession', async () => {
            expect.assertions(2);

            const save = jest.fn().mockResolvedValue(true);

            const soloStreak = jest.fn(() => ({ save }));

            const user = { _id: 'userId' };
            const courseId = 'courseId';
            const sessionId = 'ab1234';
            const totalModulesStudied = 1;
            const averageScore = 3;
            const timeStudied = 5;
            const response: any = { locals: { user } };
            const request: any = {
                params: { courseId },
                body: { sessionId, totalModulesStudied, averageScore, timeStudied },
            };
            const next = jest.fn();

            const middleware = getCreateCourseSessionFromRequestMiddleware(soloStreak as any);

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

    describe(`sendFormattedCourseSessionMiddleware`, () => {
        test('responds with status 201 with a course session', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const courseId = 'courseId';
            const sessionId = 'ab1234';
            const totalModulesStudied = 1;
            const averageScore = 3;
            const timeStudied = 5;
            const savedCourseSession = {
                courseId,
                sessionId,
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
            expect(send).toBeCalledWith(savedCourseSession);
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
        expect.assertions(4);

        expect(createCourseSessionMiddlewares.length).toEqual(3);
        expect(createCourseSessionMiddlewares[0]).toBe(createCourseSessionBodyValidationMiddleware);
        expect(createCourseSessionMiddlewares[1]).toBe(createCourseSessionFromRequestMiddleware);
        expect(createCourseSessionMiddlewares[2]).toBe(sendFormattedCourseSessionMiddleware);
    });
});
