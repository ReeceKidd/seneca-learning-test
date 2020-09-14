import supertest from 'supertest';
import { Express } from 'express';

import { UserModel } from '../../src/Models/User';
import { Routes } from '../../src/Routers';

export const createUser = async (expressApp: Express): Promise<UserModel> => {
    const userResponse = await supertest(expressApp)
        .post(`/${Routes.users}`)
        .send({ username: 'username' });
    return userResponse.body as UserModel;
};
