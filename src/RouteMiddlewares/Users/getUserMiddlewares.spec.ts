/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    userParamsValidationMiddleware,
    sendUserMiddleware,
    getUserMiddlewares,
    getRetrieveUserMiddleware,
    retrieveUserMiddleware,
} from '../Users/getUserMiddlewares';
import { CustomError, ErrorType } from '../../customError';

describe(`userParamsValidationMiddleware`, () => {
    const userId = '5d43f0c2f4499975cb312b72';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { userId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });
});

describe('retrieveUserMiddleware', () => {
    test('sets response.locals.user', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => Promise.resolve(true));
        const findById = jest.fn(() => ({ lean }));
        const userModel = {
            findById,
        };
        const userId = 'abcd';
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findById).toBeCalledWith(userId);
        expect(response.locals.user).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws GetUserNoUserFound when solo streak is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn(() => Promise.resolve(false));
        const findById = jest.fn(() => ({ lean }));
        const userModel = {
            findById,
        };
        const userId = 'abcd';
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetUserNoUserFound));
    });

    test('calls next with RetrieveUserMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const lean = jest.fn(() => Promise.reject(errorMessage));
        const findById = jest.fn(() => ({ lean }));
        const userModel = {
            findById,
        };
        const userId = 'abcd';
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveUserMiddleware, expect.any(Error)));
    });
});

describe('sendUserMiddleware', () => {
    test('sends user', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const user = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { user }, status };
        const next = jest.fn();

        sendUserMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(user);
    });

    test('calls next with SendCourseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        await sendUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUserMiddleware, expect.any(Error)));
    });
});

describe('getUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(4);

        expect(getUserMiddlewares.length).toEqual(3);
        expect(getUserMiddlewares[0]).toEqual(userParamsValidationMiddleware);
        expect(getUserMiddlewares[1]).toEqual(retrieveUserMiddleware);
        expect(getUserMiddlewares[2]).toEqual(sendUserMiddleware);
    });
});
