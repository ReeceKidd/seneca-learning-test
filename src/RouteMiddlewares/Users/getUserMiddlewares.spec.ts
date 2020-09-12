/* eslint-disable @typescript-eslint/no-explicit-any */
import { userParamsValidationMiddleware, sendUserMiddleware, getUserMiddlewares } from '../Users/getUserMiddlewares';

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

describe('sendRetrieveUserResponseMiddleware', () => {
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
});

describe('getUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(3);

        expect(getUserMiddlewares.length).toEqual(2);
        expect(getUserMiddlewares[0]).toEqual(userParamsValidationMiddleware);
        expect(getUserMiddlewares[1]).toEqual(sendUserMiddleware);
    });
});
