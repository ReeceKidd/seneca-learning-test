import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

const userParamsValidationSchema = {
    userId: Joi.string()
        .required()
        .length(24),
};

export const userParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        userParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const sendUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { user } = response.locals;
        response.status(ResponseCodes.success).send(user);
    } catch (err) {
        next(new CustomError(ErrorType.InternalServerError, err));
    }
};

export const getUserMiddlewares = [userParamsValidationMiddleware, sendUserMiddleware];
