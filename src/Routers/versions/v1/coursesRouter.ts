import { Router } from 'express';
import { authenticationMiddlewares } from '../../../SharedMiddleware/authenticationMiddlewares';
import { createCourseSessionMiddlewares } from '../../../RouteMiddlewares/Courses/createCourseSessionMiddlewares';
import { getCourseMiddlewares } from '../../../RouteMiddlewares/Courses/getCourseMiddlewares';
import { createCourseMiddlewares } from '../../../RouteMiddlewares/Courses/createCourseMiddlewares';
import { getSessionMiddlewares } from '../../../RouteMiddlewares/Sessions/getSessionMiddlewares';
import { createSessionMiddlewares } from '../../../RouteMiddlewares/Sessions/createSessionMiddlewares';

const courseId = 'courseId';
const sessionId = 'sessionId';

export enum CourseRoutes {
    sessions = 'sessions',
}

const coursesRouter = Router();

coursesRouter.use(...authenticationMiddlewares);

coursesRouter.post('/', ...createCourseMiddlewares);

coursesRouter.post(`/:${courseId}`, ...createCourseSessionMiddlewares);

coursesRouter.get(`/:${courseId}`, ...getCourseMiddlewares);

coursesRouter.post(`/:${courseId}/${CourseRoutes.sessions}`, ...createSessionMiddlewares);

coursesRouter.get(`/:${courseId}/${CourseRoutes.sessions}/:${sessionId}`, ...getSessionMiddlewares);

export { coursesRouter };
