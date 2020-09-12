/* eslint-disable */
import { CustomError, ErrorType } from './customError';

describe('customError', () => {
    test(`creates correct error when type is set to MissingUserIdHeader`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.MissingUserIdHeader);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-01`);
        expect(message).toBe('User Id is missing from request header.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to AuthUserDoesNotExist`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AuthUserDoesNotExist);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-02`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to InternalServerError`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.InternalServerError);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-01`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveUserIdFromHeaderMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveUserIdFromHeaderMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-02`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to AuthRetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.AuthRetrieveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-03`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });
});
