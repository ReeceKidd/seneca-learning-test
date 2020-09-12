/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createCourseMiddlewares,
    createCourseBodyValidationMiddleware,
    createCourseFromRequestMiddleware,
    getCreateCourseFromRequestMiddleware,
    sendFormattedCourseMiddleware,
} from './createCourseMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('createCourseMiddlewares', () => {
    describe(`createCourseBodyValidationMiddleware`, () => {
        const name = 'Biology';

        const body = {
            name,
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

            createCourseBodyValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });
    });

    describe(`createCourseFromRequestMiddleware`, () => {
        test('sets response.locals.savedCourse', async () => {
            expect.assertions(2);

            const save = jest.fn().mockResolvedValue(true);

            const courseModel = jest.fn(() => ({ save }));

            const response: any = { locals: {} };
            const name = 'Biology';
            const request: any = {
                params: {},
                body: { name },
            };
            const next = jest.fn();

            const middleware = getCreateCourseFromRequestMiddleware(courseModel as any);

            await middleware(request, response, next);

            expect(response.locals.savedCourse).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateCourseFromRequestMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateCourseFromRequestMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCourseFromRequestMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`sendFormattedCourseMiddleware`, () => {
        test('responds with status 201 with a course session', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const name = 'Biology';
            const savedCourse = {
                name,
            };
            const response: any = { locals: { savedCourse }, status };
            const request: any = {};
            const next = jest.fn();

            sendFormattedCourseMiddleware(request, response, next);

            expect(response.locals.course).toBeUndefined();
            expect(next).toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith(savedCourse);
        });

        test('calls next with SendFormattedCourseMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            sendFormattedCourseMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedCourseMiddleware, expect.any(Error)));
        });
    });

    test('that createCourse middlewares are defined in the correct order', async () => {
        expect.assertions(4);

        expect(createCourseMiddlewares.length).toEqual(3);
        expect(createCourseMiddlewares[0]).toBe(createCourseBodyValidationMiddleware);
        expect(createCourseMiddlewares[1]).toBe(createCourseFromRequestMiddleware);
        expect(createCourseMiddlewares[2]).toBe(sendFormattedCourseMiddleware);
    });
});
