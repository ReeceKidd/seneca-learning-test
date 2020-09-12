import { Router } from 'express';
import { authenticationMiddlewares } from '../../../SharedMiddleware/authenticationMiddlewares';
import { getSessionMiddlewares } from '../../../RouteMiddlewares/Sessions/getSessionMiddlewares';

const sessionsRouter = Router();

sessionsRouter.use(...authenticationMiddlewares);

export const sessionId = 'sessionId';

sessionsRouter.get(`/${sessionId}`, ...getSessionMiddlewares);

export { sessionsRouter };
