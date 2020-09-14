import supertest from 'supertest';
import { Express } from 'express';

import { UserModel } from '../../src/Models/User';
import { Routes } from '../../src/Routers';
import ApiVersions from '../../src/Server/versions';

export const createUser = async (expressApp: Express): Promise<UserModel> => {
    const userResponse = await supertest(expressApp)
        .post(`/${ApiVersions.v1}/${Routes.users}`)
        .send({ username: 'username' });
    return userResponse.body as UserModel;
};
