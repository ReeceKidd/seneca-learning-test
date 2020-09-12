import { Router } from 'express';
import { getSessionMiddlewares } from '../../../RouteMiddlewares/Sessions/getSessionMiddlewares';

const sessionsRouter = Router();

export const sessionId = 'sessionId';

sessionsRouter.get(`/${sessionId}`, ...getSessionMiddlewares);

export { sessionsRouter };
