/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createSessionMiddlewares,
    createSessionParamsValidationMiddleware,
    createSessionFromRequestMiddleware,
    getCreateSessionFromRequestMiddleware,
    sendFormattedSessionMiddleware,
} from './createSessionMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('createSessionMiddlewares', () => {
    describe(`createSessionParamsValidationMiddleware`, () => {
        const courseId = 'courseId';

        const body = {
            courseId,
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

            createSessionParamsValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });
    });

    describe(`createSessionFromRequestMiddleware`, () => {
        test('sets response.locals.savedSession', async () => {
            expect.assertions(2);

            const save = jest.fn().mockResolvedValue(true);

            const sessionModel = jest.fn(() => ({ save }));

            const response: any = { locals: {} };
            const courseId = 'courseId';
            const request: any = {
                params: {},
                body: { courseId },
            };
            const next = jest.fn();

            const middleware = getCreateSessionFromRequestMiddleware(sessionModel as any);

            await middleware(request, response, next);

            expect(response.locals.savedSession).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateSessionFromRequestMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateSessionFromRequestMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateSessionFromRequestMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`sendFormattedSessionMiddleware`, () => {
        test('responds with status 201 with a session session', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const courseId = 'courseId';
            const savedSession = {
                courseId,
            };
            const response: any = { locals: { savedSession }, status };
            const request: any = {};
            const next = jest.fn();

            sendFormattedSessionMiddleware(request, response, next);

            expect(response.locals.session).toBeUndefined();
            expect(next).toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith(savedSession);
        });

        test('calls next with SendFormattedSessionMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            sendFormattedSessionMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedSessionMiddleware, expect.any(Error)));
        });
    });

    test('that createSession middlewares are defined in the correct order', async () => {
        expect.assertions(4);

        expect(createSessionMiddlewares.length).toEqual(3);
        expect(createSessionMiddlewares[0]).toBe(createSessionParamsValidationMiddleware);
        expect(createSessionMiddlewares[1]).toBe(createSessionFromRequestMiddleware);
        expect(createSessionMiddlewares[2]).toBe(sendFormattedSessionMiddleware);
    });
});
