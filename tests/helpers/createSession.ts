import supertest from 'supertest';
import { Express } from 'express';

import { Routes } from '../../src/Routers/versions/v1';
import ApiVersions from '../../src/Server/versions';
import { SessionModel } from '../../src/Models/Session';
import { CourseRoutes } from '../../src/Routers/versions/v1/coursesRouter';

export const createSession = async ({
    expressApp,
    userId,
    courseId,
}: {
    expressApp: Express;
    userId: string;
    courseId: string;
}): Promise<SessionModel> => {
    const courseResponse = await supertest(expressApp)
        .post(`/${ApiVersions.v1}/${Routes.courses}/${courseId}/${CourseRoutes.sessions}`)
        .set('X-User-Id', userId);
    return courseResponse.body as SessionModel;
};
