import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from './setup/disconnectDatabase';
import app from '../src/app';
import { getDatabaseURI } from './setup/getDatabaseURI';
import supertest from 'supertest';
import { Routes } from '../src/Routers/versions/v1';

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

        const user = await supertest(expressApp)
            .post(`/${Routes.users}`)
            .send({ username: 'username' });

        expect(user).toBeDefined();
    });
});
