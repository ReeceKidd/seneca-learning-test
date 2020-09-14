import { Mongoose } from 'mongoose';

import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { disconnectDatabase } from './setup/disconnectDatabase';
import app from '../src/app';
import { getDatabaseURI } from './setup/getDatabaseURI';

import { createUser } from './helpers/createUser';
import { createCourse } from './helpers/createCourse';
import { createSession } from './helpers/createSession';
import { getCourse } from './helpers/getCourse';

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

    test('creates a single session for a course', async () => {
        expect.assertions(7);
        const expressApp = app({ databaseURI: getDatabaseURI({ testName }) });

        const user = await createUser(expressApp);

        const course = await createCourse({ expressApp, userId: user._id, courseName: 'Biology' });

        const totalModulesStudied = 3;
        const averageScore = 1.678;
        const timeStudied = 30;

        const session = await createSession({
            expressApp,
            userId: user._id,
            courseId: course._id,
            totalModulesStudied,
            averageScore,
            timeStudied,
        });

        expect(session.sessionId).toBeDefined();
        expect(session.totalModulesStudied).toEqual(totalModulesStudied);
        expect(session.averageScore).toEqual(1.68);
        expect(session.timeStudied).toEqual(timeStudied);

        const updatedCourse = await getCourse({ expressApp, userId: user._id, courseId: course._id });

        expect(updatedCourse.totalModulesStudied).toEqual(totalModulesStudied);
        expect(updatedCourse.averageScore).toEqual(1.68);
        expect(updatedCourse.timeStudied).toEqual(timeStudied);
    });
});
