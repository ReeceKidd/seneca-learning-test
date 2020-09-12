import supertest from 'supertest';
import { Express } from 'express';

import { UserModel } from '../../src/Models/User';
import { Routes } from '../../src/Routers/versions/v1';
import ApiVersions from '../../src/Server/versions';

export const getUser = async (expressApp: Express): Promise<UserModel> => {
    const user = await supertest(expressApp)
        .post(`/${ApiVersions.v1}/${Routes.users}`)
        .send({ username: 'username' });
    return user.body as UserModel;
};
