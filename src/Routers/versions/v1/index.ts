import { Router } from 'express';
import { coursesRouter } from './coursesRouter';
import { usersRouter } from './userRouter';

const v1Router = Router();

export enum Routes {
    courses = 'courses',
    users = 'users',
}

v1Router.use(`/${Routes.courses}`, coursesRouter);
v1Router.use(`/${Routes.users}`, usersRouter);

export default v1Router;
