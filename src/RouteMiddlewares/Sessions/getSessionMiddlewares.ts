import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { sessionModel, SessionModel } from '../../Models/Session';
import { CustomError, ErrorType } from '../../customError';

const getSessionParamsValidationSchema = {
    sessionId: Joi.string().required(),
    courseId: Joi.string().required(),
};

export const sessionParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        getSessionParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveSessionMiddleware = (sessionModel: mongoose.Model<SessionModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { sessionId } = request.params;
        const session = await sessionModel.findOne({ _id: sessionId }).lean();
        if (!session) {
            throw new CustomError(ErrorType.GetSessionNoSessionFound);
        }
        response.locals.session = session;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveSessionMiddleware, err));
    }
};

export const retrieveSessionMiddleware = getRetrieveSessionMiddleware(sessionModel);

export const sendSessionMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { session } = response.locals;
        const { _id, totalModulesStudied, averageScore, timeStudied } = session;
        response.send({
            sessionId: _id,
            totalModulesStudied,
            averageScore,
            timeStudied,
        });
    } catch (err) {
        next(new CustomError(ErrorType.SendSessionMiddleware, err));
    }
};

export const getSessionMiddlewares = [
    sessionParamsValidationMiddleware,
    retrieveSessionMiddleware,
    sendSessionMiddleware,
];
