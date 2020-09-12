import { Mongoose } from 'mongoose';

import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { disconnectDatabase } from './setup/disconnectDatabase';
import app from '../src/app';
import { getDatabaseURI } from './setup/getDatabaseURI';

import { getUser } from './helpers/getUser';

jest.setTimeout(120000);

const testName = 'my-pulse-question-one-test';

describe('Question One', () => {
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

    test(testName, async () => {
        const expressApp = app({ databaseURI: getDatabaseURI({ testName }) });

        const user = await getUser(expressApp);

        console.log(user);

        expect(user).toBeDefined();
    });
});
