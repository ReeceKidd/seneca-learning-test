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
import ApiVersions from '../src/Server/versions';
import { Routes } from '../src/Routers/versions/v1';
import { CourseRoutes } from '../src/Routers/versions/v1/coursesRouter';
import { SessionModel } from '../src/Models/Session';
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

        const userSession = await createSession({ expressApp, userId: user._id, courseId: course._id });

        const route = `/${ApiVersions.v1}/${Routes.courses}/${course._id}/${CourseRoutes.sessions}/${userSession._id}`;

        const sessionResponse = await supertest(expressApp)
            .get(route)
            .set('X-User-Id', user._id);

        const session = sessionResponse.body as SessionModel;

        expect(session.userId).toEqual(user._id);
        expect(session.courseId).toEqual(course._id);
        expect(session.totalModulesStudied).toEqual(0);
        expect(session.averageScore).toEqual(0);
        expect(session.timeStudied).toEqual(0);
    });
});
