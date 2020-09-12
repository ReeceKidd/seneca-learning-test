/* eslint-disable */
import { ResponseCodes } from './Server/responseCodes';

export enum ErrorType {
    InternalServerError,
    MissingUserIdHeader,
    RetrieveUserIdFromHeaderMiddleware,
    AuthRetrieveUserMiddleware,
    AuthUserDoesNotExist,
    CreateCourseSessionFromRequestMiddleware,
    SendFormattedCourseSessionMiddleware,
    RetrieveCourseMiddleware,
    SendCourseMiddleware,
    GetCourseNoCourseFound,
    IncreaseStatsForCourseMiddleware,
    UpdateAverageForCourseMiddleware,
    SendUserMiddleware,
    RetrieveUserMiddleware,
    GetUserNoUserFound,
    GetSessionNoSessionFound,
    RetrieveSessionMiddleware,
    SendSessionMiddleware,
    CreateUserFromRequestMiddleware,
    SendFormattedUserMiddleware,
    CreateCourseFromRequestMiddleware,
    SendFormattedCourseMiddleware,
}

const internalServerMessage = 'Internal Server Error.';

export class CustomError extends Error {
    public code: string;
    public message: string;
    public httpStatusCode: ResponseCodes;

    constructor(type: ErrorType, err?: Error) {
        super();
        const { code, message, httpStatusCode } = this.createCustomErrorData(type);
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }

    private createCustomErrorData(type: ErrorType): { code: string; message: string; httpStatusCode: ResponseCodes } {
        switch (type) {
            case ErrorType.MissingUserIdHeader:
                return {
                    code: `${ResponseCodes.badRequest}-01`,
                    message: 'User Id is missing from request header.',
                    httpStatusCode: ResponseCodes.badRequest,
                };

            case ErrorType.AuthUserDoesNotExist:
                return {
                    code: `${ResponseCodes.badRequest}-02`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };

            case ErrorType.GetCourseNoCourseFound:
                return {
                    code: `${ResponseCodes.badRequest}-03`,
                    message: 'Course does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };

            case ErrorType.GetUserNoUserFound:
                return {
                    code: `${ResponseCodes.badRequest}-04`,
                    message: 'User does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };

            case ErrorType.GetSessionNoSessionFound:
                return {
                    code: `${ResponseCodes.badRequest}-05`,
                    message: 'Session does not exist.',
                    httpStatusCode: ResponseCodes.badRequest,
                };

            case ErrorType.RetrieveUserIdFromHeaderMiddleware:
                return {
                    code: `${ResponseCodes.warning}-02`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.AuthRetrieveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-03`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCourseSessionFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-04`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedCourseSessionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-05`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetrieveCourseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-06`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendCourseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-07`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.IncreaseStatsForCourseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-08`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.UpdateAverageForCourseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-09`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-10`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetrieveUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-11`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.RetrieveSessionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-12`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendSessionMiddleware:
                return {
                    code: `${ResponseCodes.warning}-13`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateUserFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-14`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedUserMiddleware:
                return {
                    code: `${ResponseCodes.warning}-15`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.CreateCourseFromRequestMiddleware:
                return {
                    code: `${ResponseCodes.warning}-16`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            case ErrorType.SendFormattedCourseMiddleware:
                return {
                    code: `${ResponseCodes.warning}-17`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };

            default:
                return {
                    code: `${ResponseCodes.warning}-01`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
        }
    }
}
