import { Router } from 'express';
import { authenticationMiddlewares } from '../../../SharedMiddleware/authenticationMiddlewares';
import { createCourseSessionMiddlewares } from '../../../RouteMiddlewares/Courses/createCourseSessionMiddlewares';
import { getCourseMiddlewares } from '../../../RouteMiddlewares/Courses/getCourseMiddlewares';
import { sessionsRouter } from './sessionsRouter';

const coursesRouter = Router();

coursesRouter.use(...authenticationMiddlewares);

export const courseId = 'courseId';

export enum CourseRoutes {
    sessions = 'sessions',
}

coursesRouter.post(`/:${courseId}`, ...createCourseSessionMiddlewares);

coursesRouter.get(`/:${courseId}`, ...getCourseMiddlewares);

coursesRouter.use(`/:${courseId}/${CourseRoutes.sessions}`, sessionsRouter);

export { coursesRouter };
