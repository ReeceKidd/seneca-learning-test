/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express';
import { getValidationErrorMessageSenderMiddleware } from './validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../Server/responseCodes';

describe(`validationErrorMessageSenderMiddleware`, () => {
    test("calls 'next' middleware if all params are correct ", () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: { param: true },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();
        const middleware = getValidationErrorMessageSenderMiddleware(
            request as any,
            response as Response,
            next as NextFunction,
        );

        middleware(undefined as any);

        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('check that notAllowedParameter error is thrown when error message returns is not allowed', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request = {
            query: { param: true },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();
        const middleware = getValidationErrorMessageSenderMiddleware(
            request as any,
            response as Response,
            next as NextFunction,
        );
        const paramNotAllowedError = '"param" is not allowed';

        middleware(new Error(paramNotAllowedError));

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({ message: paramNotAllowedError });
        expect(next).not.toBeCalled();
    });

    test(`returns ${ResponseCodes.unprocessableEntity} if value of one of the parameters is missing`, () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: { param: true },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();
        const middleware = getValidationErrorMessageSenderMiddleware(
            request as any,
            response as Response,
            next as NextFunction,
        );
        const otherError = 'other error';

        middleware(new Error('other error'));

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({ message: otherError });
        expect(next).not.toBeCalled();
    });
});
