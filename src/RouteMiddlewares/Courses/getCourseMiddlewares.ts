import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { courseModel, CourseModel } from '../../Models/Course';
import { CustomError, ErrorType } from '../../customError';

const getCourseParamsValidationSchema = {
    courseId: Joi.string().required(),
};

export const courseParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        getCourseParamsValidationSchema,
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

export const sendCourseMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { course } = response.locals;
        const { totalModulesStudied, averageScore, timeStudied } = course;
        response.send({ totalModulesStudied, averageScore, timeStudied });
    } catch (err) {
        next(new CustomError(ErrorType.SendCourseMiddleware, err));
    }
};

export const getCourseMiddlewares = [courseParamsValidationMiddleware, retrieveCourseMiddleware, sendCourseMiddleware];
