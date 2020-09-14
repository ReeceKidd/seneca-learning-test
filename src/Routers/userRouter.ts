import { Router } from 'express';
import { getSessionMiddlewares } from '../RouteMiddlewares/Sessions/getSessionMiddlewares';
import { createUserMiddlewares } from '../RouteMiddlewares/Users/createUserMiddlewares';

export const userId = 'userId';

const usersRouter = Router();

usersRouter.get(`/${userId}`, ...getSessionMiddlewares);

usersRouter.post('/', ...createUserMiddlewares);

export { usersRouter };
