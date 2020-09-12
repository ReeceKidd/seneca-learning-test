import supertest from 'supertest';
import { Express } from 'express';

import { Routes } from '../../src/Routers/versions/v1';
import ApiVersions from '../../src/Server/versions';
import { CourseModel } from '../../src/Models/Course';

export const getCourse = async ({
    expressApp,
    userId,
    courseName,
}: {
    expressApp: Express;
    userId: string;
    courseName: string;
}): Promise<CourseModel> => {
    const course = await supertest(expressApp)
        .post(`/${ApiVersions.v1}/${Routes.courses}`)
        .set('X-User-Id', userId)
        .send({ name: courseName });
    return course.body as CourseModel;
};
