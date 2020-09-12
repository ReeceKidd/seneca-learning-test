/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createUserMiddlewares,
    createUserBodyValidationMiddleware,
    createUserFromRequestMiddleware,
    getCreateUserFromRequestMiddleware,
    sendFormattedUserMiddleware,
} from './createUserMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('createUserMiddlewares', () => {
    describe(`createUserBodyValidationMiddleware`, () => {
        const username = 'username';

        const body = {
            username,
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

            createUserBodyValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });
    });

    describe(`createUserFromRequestMiddleware`, () => {
        test('sets response.locals.savedUser', async () => {
            expect.assertions(2);

            const save = jest.fn().mockResolvedValue(true);

            const userModel = jest.fn(() => ({ save }));

            const response: any = { locals: {} };
            const username = 'username';
            const request: any = {
                params: {},
                body: { username },
            };
            const next = jest.fn();

            const middleware = getCreateUserFromRequestMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.savedUser).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with CreateUserFromRequestMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateUserFromRequestMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateUserFromRequestMiddleware, expect.any(Error)));
        });
    });

    describe(`sendFormattedUserMiddleware`, () => {
        test('responds with status 201 with a user session', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const username = 'username';
            const savedUser = {
                username,
            };
            const response: any = { locals: { savedUser }, status };
            const request: any = {};
            const next = jest.fn();

            sendFormattedUserMiddleware(request, response, next);

            expect(response.locals.user).toBeUndefined();
            expect(next).toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith(savedUser);
        });

        test('calls next with SendFormattedUserMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            sendFormattedUserMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedUserMiddleware, expect.any(Error)));
        });
    });

    test('that createUser middlewares are defined in the correct order', async () => {
        expect.assertions(4);

        expect(createUserMiddlewares.length).toEqual(3);
        expect(createUserMiddlewares[0]).toBe(createUserBodyValidationMiddleware);
        expect(createUserMiddlewares[1]).toBe(createUserFromRequestMiddleware);
        expect(createUserMiddlewares[2]).toBe(sendFormattedUserMiddleware);
    });
});
