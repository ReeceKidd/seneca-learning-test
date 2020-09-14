import { Mongoose } from 'mongoose';
import supertest from 'supertest';

import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { disconnectDatabase } from './setup/disconnectDatabase';
import app from '../src/app';
import { getDatabaseURI } from './setup/getDatabaseURI';

import { createUser } from './helpers/createUser';
import { createCourse } from './helpers/createCourse';
import { Routes } from '../src/Routers';
import { CourseRoutes } from '../src/Routers/coursesRouter';
import { createSession } from './helpers/createSession';

jest.setTimeout(120000);

const testName = 'sessions-get-one';

describe('Sessions', () => {
    let database: Mongoose;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase({ database });
            await disconnectDatabase({ database });
        }
    });

    test('retrieves a single session', async () => {
        const expressApp = app({ databaseURI: getDatabaseURI({ testName }) });

        const user = await createUser(expressApp);

        const course = await createCourse({ expressApp, userId: user._id, courseName: 'Biology' });

        const totalModulesStudied = 3;
        const averageScore = 1.678;
        const timeStudied = 30;

        const userSession = await createSession({
            expressApp,
            userId: user._id,
            courseId: course._id,
            totalModulesStudied,
            averageScore,
            timeStudied,
        });

        const route = `/${Routes.courses}/${course._id}/${CourseRoutes.sessions}/${userSession.sessionId}`;

        const sessionResponse = await supertest(expressApp)
            .get(route)
            .set('X-User-Id', user._id);

        const session = sessionResponse.body;

        expect(session.sessionId).toBeDefined();
        expect(session.totalModulesStudied).toEqual(totalModulesStudied);
        expect(session.averageScore).toEqual(1.68);
        expect(session.timeStudied).toEqual(timeStudied);
    });
});
