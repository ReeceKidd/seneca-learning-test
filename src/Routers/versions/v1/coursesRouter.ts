import { Router } from 'express';
import { authenticationMiddlewares } from '../../../SharedMiddleware/authenticationMiddlewares';
import { createCourseSessionMiddlewares } from '../../../RouteMiddlewares/Courses/createCourseSessionMiddlewares';
import { getCourseMiddlewares } from '../../../RouteMiddlewares/Courses/getCourseMiddlewares';

const coursesRouter = Router();

coursesRouter.use(...authenticationMiddlewares);

export const courseId = 'courseId';

coursesRouter.post(`/:${courseId}`, ...createCourseSessionMiddlewares);

coursesRouter.get(`/${courseId}`, ...getCourseMiddlewares);

export { coursesRouter };
