/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    authenticationMiddlewares,
    getRetrieveUserMiddleware,
    retrieveUserMiddleware,
    retrieveUserIdFromHeaderMiddleware,
} from './authenticationMiddlewares';

import { CustomError } from '../../src/customError';
import { ErrorType } from '../../src/customError';

describe(`retrieveUserIdFromHeaderMiddleware`, () => {
    test('retrieves userId and sets response.locals.user .', () => {
        expect.assertions(2);
        const xUserId = 'userId';
        const header = jest.fn(() => xUserId);
        const request: any = {
            header,
        };
        const response: any = { locals: {} };
        const next = jest.fn();

        retrieveUserIdFromHeaderMiddleware(request, response, next);

        expect(response.locals.userId).toBeDefined();
        expect(next).toBeCalled();
    });

    test('when request.header does not contain userId throw MissingUserIdHeader error', () => {
        expect.assertions(1);
        const header = jest.fn(() => undefined);
        const request: any = {
            header,
        };
        const response: any = {};
        const next = jest.fn();

        retrieveUserIdFromHeaderMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.MissingUserIdHeader));
    });

    test('calls next with RetrieveUserIdFromHeaderMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();

        retrieveUserIdFromHeaderMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveUserIdFromHeaderMiddleware, expect.any(Error)));
    });
});

describe('retrieveUserMiddleware', () => {
    test('retrieves user from database sets response.locals.user and calls next()', async () => {
        expect.assertions(4);
        const userId = '1234';
        const lean = jest.fn(() => true);
        const findById = jest.fn(() => ({ lean }));
        const userModel = { findById };
        const request: any = {};
        const response: any = { locals: { userId } };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.user).toBeDefined();
        expect(findById).toBeCalledWith(userId);
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws AuthUserDoesNotExist when user does not exist', async () => {
        expect.assertions(1);
        const userId = '12434';
        const lean = jest.fn(() => false);
        const findById = jest.fn(() => ({ lean }));
        const userModel = { findById };
        const request: any = {};
        const response: any = { locals: { userId } };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AuthUserDoesNotExist));
    });

    test('throws RetrieveUserMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const userId = 'abcd';
        const findById = jest.fn(() => ({}));
        const userModel = { findById };
        const request: any = { body: { userId } };
        const response: any = { status, locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AuthRetrieveUserMiddleware, expect.any(Error)));
    });
});

describe(`authenticationMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(3);

        expect(authenticationMiddlewares.length).toEqual(2);
        expect(authenticationMiddlewares[0]).toBe(retrieveUserIdFromHeaderMiddleware);
        expect(authenticationMiddlewares[1]).toBe(retrieveUserMiddleware);
    });
});
