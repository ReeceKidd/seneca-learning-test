import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { SessionModel, sessionModel } from '../../Models/Session';
import { UserModel } from '../../Models/User';

const createCourseSessionParamsValidationSchema = {
    courseId: Joi.string().required(),
};

export const createCourseSessionParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        createCourseSessionParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const createCourseSessionBodyValidationSchema = {
    sessionId: Joi.string().required(),
    totalModulesStudied: Joi.number().required(),
    averageScore: Joi.number().required(),
    timeStudied: Joi.number().required(),
};

export const createCourseSessionBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createCourseSessionBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateCourseSessionFromRequestMiddleware = (session: mongoose.Model<SessionModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: UserModel = response.locals.user;
        const { courseId } = request.params;
        const { sessionId, totalModulesStudied, averageScore, timeStudied } = request.body;
        const newCourseSession = new session({
            userId: user._id,
            courseId,
            sessionId,
            totalModulesStudied,
            averageScore,
            timeStudied,
        });
        response.locals.savedCourseSession = await newCourseSession.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCourseSessionFromRequestMiddleware, err));
    }
};

export const createCourseSessionFromRequestMiddleware = getCreateCourseSessionFromRequestMiddleware(sessionModel);

export const sendFormattedCourseSessionMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { savedCourseSession } = response.locals;
        response.status(ResponseCodes.created).send(savedCourseSession);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedCourseSessionMiddleware, err));
    }
};

export const createCourseSessionMiddlewares = [
    createCourseSessionBodyValidationMiddleware,
    createCourseSessionFromRequestMiddleware,
    sendFormattedCourseSessionMiddleware,
];
