import { Router } from 'express';
import { coursesRouter } from './coursesRouter';

const v1Router = Router();

v1Router.use(`/courses`, coursesRouter);

export default v1Router;
