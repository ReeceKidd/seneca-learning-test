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

            default:
                return {
                    code: `${ResponseCodes.warning}-01`,
                    message: internalServerMessage,
                    httpStatusCode: ResponseCodes.warning,
                };
        }
    }
}
