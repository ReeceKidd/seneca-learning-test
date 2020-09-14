import { Router } from 'express';
import { coursesRouter } from './coursesRouter';
import { usersRouter } from './userRouter';

const indexRouter = Router();

export enum Routes {
    courses = 'courses',
    users = 'users',
}

indexRouter.use(`/${Routes.courses}`, coursesRouter);
indexRouter.use(`/${Routes.users}`, usersRouter);

export default indexRouter;
