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

    test(`creates correct error when type is set to GetCourseNoCourseFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetCourseNoCourseFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-03`);
        expect(message).toBe('Course does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetUserNoUserFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetUserNoUserFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-04`);
        expect(message).toBe('User does not exist.');
        expect(httpStatusCode).toBe(400);
    });

    test(`creates correct error when type is set to GetSessionNoSessionFound`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.GetSessionNoSessionFound);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`400-05`);
        expect(message).toBe('Session does not exist.');
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

    test(`creates correct error when type is set to CreateCourseSessionFromRequestMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.CreateCourseSessionFromRequestMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-04`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendFormattedCourseSessionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendFormattedCourseSessionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-05`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveCourseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveCourseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-06`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendCourseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendCourseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-07`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to IncreaseStatsForCourseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.IncreaseStatsForCourseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-08`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to UpdateAverageForCourseMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.UpdateAverageForCourseMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-09`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-10`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveUserMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveUserMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-11`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to RetrieveSessionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.RetrieveSessionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-12`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });

    test(`creates correct error when type is set to SendSessionMiddleware`, () => {
        expect.assertions(3);

        const customError = new CustomError(ErrorType.SendSessionMiddleware);
        const { code, message, httpStatusCode } = customError;

        expect(code).toBe(`500-13`);
        expect(message).toBe('Internal Server Error.');
        expect(httpStatusCode).toBe(500);
    });
});
