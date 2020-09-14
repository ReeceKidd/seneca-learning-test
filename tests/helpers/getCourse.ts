import supertest from 'supertest';
import { Express } from 'express';

import { Routes } from '../../src/Routers';
import { CourseModel } from '../../src/Models/Course';

export const getCourse = async ({
    expressApp,
    userId,
    courseId,
}: {
    expressApp: Express;
    userId: string;
    courseId: string;
}): Promise<CourseModel> => {
    const courseResponse = await supertest(expressApp)
        .get(`/${Routes.courses}/${courseId}`)
        .set('X-User-Id', userId);
    return courseResponse.body as CourseModel;
};
