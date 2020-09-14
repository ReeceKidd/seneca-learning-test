import supertest from 'supertest';
import { Express } from 'express';

import { Routes } from '../../src/Routers';
import ApiVersions from '../../src/Server/versions';
import { CourseModel } from '../../src/Models/Course';

export const createCourse = async ({
    expressApp,
    userId,
    courseName,
}: {
    expressApp: Express;
    userId: string;
    courseName: string;
}): Promise<CourseModel> => {
    const courseResponse = await supertest(expressApp)
        .post(`/${ApiVersions.v1}/${Routes.courses}`)
        .set('X-User-Id', userId)
        .send({ name: courseName });
    return courseResponse.body as CourseModel;
};
