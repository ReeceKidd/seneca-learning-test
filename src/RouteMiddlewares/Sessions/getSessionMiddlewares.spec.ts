/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getSessionMiddlewares,
    retrieveSessionMiddleware,
    getRetrieveSessionMiddleware,
    sendSessionMiddleware,
    sessionParamsValidationMiddleware,
} from './getSessionMiddlewares';

import { ErrorType, CustomError } from '../../customError';

describe(`sessionParamsValidationMiddleware`, () => {
    const sessionId = '12345678';
    const courseId = 'abcdefghi';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { sessionId, courseId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        sessionParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });
});

describe('retrieveSessionMiddleware', () => {
    test('sets response.locals.session', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => Promise.resolve(true));
        const findOne = jest.fn(() => ({ lean }));
        const sessionModel = {
            findOne,
        };
        const sessionId = 'abcd';
        const request: any = { params: { sessionId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveSessionMiddleware(sessionModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: sessionId });
        expect(response.locals.session).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws GetSessionNoSessionFound when solo streak is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn(() => Promise.resolve(false));
        const findOne = jest.fn(() => ({ lean }));
        const sessionModel = {
            findOne,
        };
        const sessionId = 'abcd';
        const request: any = { params: { sessionId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveSessionMiddleware(sessionModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetSessionNoSessionFound));
    });

    test('calls next with RetrieveSessionMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const lean = jest.fn(() => Promise.reject(errorMessage));
        const findOne = jest.fn(() => ({ lean }));
        const sessionModel = {
            findOne,
        };
        const sessionId = 'abcd';
        const request: any = { params: { sessionId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveSessionMiddleware(sessionModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveSessionMiddleware, expect.any(Error)));
    });
});

describe('sendSessionMiddleware', () => {
    test('sends session', () => {
        expect.assertions(2);
        const send = jest.fn();
        const _id = 'abc';
        const totalModulesStudied = 10;
        const averageScore = 30;
        const timeStudied = 40;
        const session = { _id: 'abc', totalModulesStudied, averageScore, timeStudied };
        const request: any = {};
        const response: any = { locals: { session }, send };
        const next = jest.fn();

        sendSessionMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(send).toBeCalledWith({
            sessionId: _id,
            totalModulesStudied,
            averageScore,
            timeStudied,
        });
    });

    test('calls next with SendSessionMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        await sendSessionMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendSessionMiddleware, expect.any(Error)));
    });
});

describe('getSessionMiddlewares', () => {
    test('that getSessionMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getSessionMiddlewares.length).toEqual(3);
        expect(getSessionMiddlewares[0]).toEqual(sessionParamsValidationMiddleware);
        expect(getSessionMiddlewares[1]).toEqual(retrieveSessionMiddleware);
        expect(getSessionMiddlewares[2]).toEqual(sendSessionMiddleware);
    });
});
