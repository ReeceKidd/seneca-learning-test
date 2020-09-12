import { Router } from 'express';
import { authenticationMiddlewares } from '../../../SharedMiddleware/authenticationMiddlewares';
import { getSessionMiddlewares } from '../../../RouteMiddlewares/Sessions/getSessionMiddlewares';

const usersRouter = Router();

usersRouter.use(...authenticationMiddlewares);

export const userId = 'userId';

usersRouter.get(`/${userId}`, ...getSessionMiddlewares);

export { usersRouter };
