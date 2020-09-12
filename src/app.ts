import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import ApiVersions from './Server/versions';

import { errorHandler } from './errorHandler';
import v1Router from './Routers/versions/v1';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default ({ databaseURI }: { databaseURI: string }) => {
    const app = express();

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));

    app.get(`/health`, (request, response) => {
        return response.status(200).send({ message: 'success' });
    });

    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    mongoose.connect(databaseURI).catch(async err => {
        console.log(err);
    });

    app.use(`/${ApiVersions.v1}`, v1Router);

    app.use(errorHandler);

    return app;
};
