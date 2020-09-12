import { Router } from 'express';
import { authenticationMiddlewares } from '../../../SharedMiddleware/authenticationMiddlewares';
import { createCourseSessionMiddlewares } from '../../../RouteMiddlewares/Sessions/createCourseSessionMiddlewares';
import { getCourseMiddlewares } from '../../../RouteMiddlewares/Courses/getCourseMiddlewares';
import { sessionsRouter } from './sessionsRouter';
import { createCourseMiddlewares } from '../../../RouteMiddlewares/Courses/createCourseMiddlewares';

const coursesRouter = Router();

coursesRouter.use(...authenticationMiddlewares);

export const courseId = 'courseId';

export enum CourseRoutes {
    sessions = 'sessions',
}

coursesRouter.post('/', ...createCourseMiddlewares);

coursesRouter.post(`/:${courseId}`, ...createCourseSessionMiddlewares);

coursesRouter.get(`/:${courseId}`, ...getCourseMiddlewares);

coursesRouter.use(`/:${courseId}/${CourseRoutes.sessions}`, sessionsRouter);

export { coursesRouter };
