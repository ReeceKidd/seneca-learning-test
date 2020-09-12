import { Router } from 'express';
import { authenticationMiddlewares } from '../../../SharedMiddleware/authenticationMiddlewares';
import { getUserMiddlewares } from '../../../RouteMiddlewares/Users/getUserMiddlewares';

const coursesRouter = Router();

coursesRouter.use(...authenticationMiddlewares);

export const courseId = 'courseId';

coursesRouter.post(`/:${courseId}`, ...getUserMiddlewares);

export { coursesRouter };
