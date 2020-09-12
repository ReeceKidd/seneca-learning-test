import { Router } from 'express';

import { getUserMiddlewares } from '../../../RouteMiddlewares/Users/getUserMiddlewares';

export const userId = 'userId';

const usersRouter = Router();

usersRouter.get(`/:${userId}`, ...getUserMiddlewares);

export { usersRouter };
