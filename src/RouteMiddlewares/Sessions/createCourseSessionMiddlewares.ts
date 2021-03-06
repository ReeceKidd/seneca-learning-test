import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { SessionModel, sessionModel } from '../../Models/Session';
import { UserModel } from '../../Models/User';
import { CourseModel, courseModel } from '../../Models/Course';

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
    totalModulesStudied: Joi.number()
        .positive()
        .required(),
    averageScore: Joi.number()
        .positive()
        .required(),
    timeStudied: Joi.number()
        .positive()
        .required(),
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

export const getRetrieveCourseMiddleware = (courseModel: mongoose.Model<CourseModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { courseId } = request.params;
        const course = await courseModel.findOne({ _id: courseId }).lean();
        if (!course) {
            throw new CustomError(ErrorType.GetCourseNoCourseFound);
        }
        response.locals.course = course;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveCourseMiddleware, err));
    }
};

export const retrieveCourseMiddleware = getRetrieveCourseMiddleware(courseModel);

export const getCreateCourseSessionFromRequestMiddleware = (session: mongoose.Model<SessionModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: UserModel = response.locals.user;
        const { courseId } = request.params;
        const averageScore: number = request.body.averageScore;
        const { totalModulesStudied, timeStudied } = request.body;
        const newCourseSession = new session({
            userId: user._id,
            courseId,
            totalModulesStudied,
            averageScore: Number(averageScore.toFixed(2)),
            timeStudied,
        });
        response.locals.savedCourseSession = await newCourseSession.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCourseSessionFromRequestMiddleware, err));
    }
};

export const createCourseSessionFromRequestMiddleware = getCreateCourseSessionFromRequestMiddleware(sessionModel);

export const getIncreaseStatsForCourseMiddleware = (course: mongoose.Model<CourseModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { courseId } = request.params;
        const { totalModulesStudied, timeStudied } = request.body;
        await course.findByIdAndUpdate(courseId, { $inc: { timeStudied, totalModulesStudied } });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncreaseStatsForCourseMiddleware, err));
    }
};

export const increaseStatsForCourseMiddleware = getIncreaseStatsForCourseMiddleware(courseModel);

export const getUpdateAverageForCourseMiddleware = (courseImport: mongoose.Model<CourseModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const course: CourseModel = response.locals.course;
        const averageScore: number = request.body.averageScore;

        if (!course.averageScore) {
            const roundedAverage = Number(averageScore.toFixed(2));
            console.log();
            await courseImport.findByIdAndUpdate(course._id, { $set: { averageScore: roundedAverage } });
        } else {
            const updatedAverage = (course.averageScore + averageScore) / 2;
            const roundedAverage = Number(updatedAverage.toFixed(2));
            await courseImport.findByIdAndUpdate(course._id, { $set: { averageScore: roundedAverage } });
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.UpdateAverageForCourseMiddleware, err));
    }
};

export const updateAverageForCourseMiddleware = getUpdateAverageForCourseMiddleware(courseModel);

export const sendFormattedCourseSessionMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { savedCourseSession } = response.locals;
        const { _id, totalModulesStudied, averageScore, timeStudied } = savedCourseSession;
        response.status(ResponseCodes.created).send({
            sessionId: _id,
            totalModulesStudied,
            averageScore,
            timeStudied,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedCourseSessionMiddleware, err));
    }
};

export const createCourseSessionMiddlewares = [
    createCourseSessionParamsValidationMiddleware,
    createCourseSessionBodyValidationMiddleware,
    retrieveCourseMiddleware,
    createCourseSessionFromRequestMiddleware,
    increaseStatsForCourseMiddleware,
    updateAverageForCourseMiddleware,
    sendFormattedCourseSessionMiddleware,
];
