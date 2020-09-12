import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { UserModel, userModel } from '../../Models/User';

const createUserBodyValidationSchema = {
    username: Joi.string().required(),
};

export const createUserBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        createUserBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateUserFromRequestMiddleware = (user: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { username } = request.body;
        const newUser = new user({
            username,
        });
        response.locals.savedUser = await newUser.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateUserFromRequestMiddleware, err));
    }
};

export const createUserFromRequestMiddleware = getCreateUserFromRequestMiddleware(userModel);

export const sendFormattedUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedUser } = response.locals;
        response.status(ResponseCodes.created).send(savedUser);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedUserMiddleware, err));
    }
};

export const createUserMiddlewares = [
    createUserBodyValidationMiddleware,
    createUserFromRequestMiddleware,
    sendFormattedUserMiddleware,
];
