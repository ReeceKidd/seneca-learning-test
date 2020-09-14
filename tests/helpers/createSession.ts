import supertest from 'supertest';
import { Express } from 'express';

import { Routes } from '../../src/Routers';

export const createSession = async ({
    expressApp,
    userId,
    courseId,
    totalModulesStudied,
    averageScore,
    timeStudied,
}: {
    expressApp: Express;
    userId: string;
    courseId: string;
    totalModulesStudied: number;
    averageScore: number;
    timeStudied: number;
}): Promise<{ sessionId: string; totalModulesStudied: number; averageScore: number; timeStudied: number }> => {
    const courseResponse = await supertest(expressApp)
        .post(`/${Routes.courses}/${courseId}`)
        .set('X-User-Id', userId)
        .send({
            totalModulesStudied,
            averageScore,
            timeStudied,
        });
    return courseResponse.body;
};
