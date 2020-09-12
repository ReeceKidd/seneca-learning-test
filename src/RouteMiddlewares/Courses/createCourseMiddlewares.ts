import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { CourseModel, courseModel } from '../../Models/Course';

const createCourseBodyValidationSchema = {
    name: Joi.string().required(),
};

export const createCourseBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createCourseBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateCourseFromRequestMiddleware = (course: mongoose.Model<CourseModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name } = request.body;
        const newCourse = new course({
            name,
        });
        response.locals.savedCourse = await newCourse.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCourseFromRequestMiddleware, err));
    }
};

export const createCourseFromRequestMiddleware = getCreateCourseFromRequestMiddleware(courseModel);

export const sendFormattedCourseMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedCourse } = response.locals;
        response.status(ResponseCodes.created).send(savedCourse);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedCourseMiddleware, err));
    }
};

export const createCourseMiddlewares = [
    createCourseBodyValidationMiddleware,
    createCourseFromRequestMiddleware,
    sendFormattedCourseMiddleware,
];
