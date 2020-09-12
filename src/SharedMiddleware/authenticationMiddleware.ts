import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { CustomError, ErrorType } from '../customError';
import { UserModel, userModel } from '../Models/User';

export const retrieveUserIdFromHeaderMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const userId = request.header('X-User-Id');
        if (!userId) {
            throw new CustomError(ErrorType.MissingUserIdHeader);
        }
        response.locals.userId = userId;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveUserIdFromHeaderMiddleware, err));
    }
};

export const getRetrieveUserMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = response.locals;

        const user = await userModel.findById(userId).lean();
        if (!user) {
            throw new CustomError(ErrorType.AuthUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.AuthRetrieveUserMiddleware, err));
    }
};

export const retrieveUserMiddleware = getRetrieveUserMiddleware(userModel);

export const authenticationMiddlewares = [retrieveUserIdFromHeaderMiddleware, retrieveUserMiddleware];
