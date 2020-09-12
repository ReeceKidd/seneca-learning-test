import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { SessionModel, sessionModel } from '../../Models/Session';
import { UserModel } from '../../Models/User';

const createSessionParamsValidationSchema = {
    courseId: Joi.string().required(),
};

export const createSessionParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        createSessionParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateSessionFromRequestMiddleware = (session: mongoose.Model<SessionModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: UserModel = response.locals.user;
        const { courseId } = request.params;
        const newSession = new session({
            courseId,
            userId: user._id,
        });
        response.locals.savedSession = await newSession.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateSessionFromRequestMiddleware, err));
    }
};

export const createSessionFromRequestMiddleware = getCreateSessionFromRequestMiddleware(sessionModel);

export const sendFormattedSessionMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedSession } = response.locals;
        response.status(ResponseCodes.created).send(savedSession);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedSessionMiddleware, err));
    }
};

export const createSessionMiddlewares = [
    createSessionParamsValidationMiddleware,
    createSessionFromRequestMiddleware,
    sendFormattedSessionMiddleware,
];
