/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getOneCourseMiddlewares,
    retrieveCourseMiddleware,
    getRetrieveCourseMiddleware,
    sendCourseMiddleware,
    courseParamsValidationMiddleware,
} from './getCourseMiddlewares';

import { ErrorType, CustomError } from '../../customError';

describe(`courseParamsValidationMiddleware`, () => {
    const courseId = '12345678';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { courseId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        courseParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });
});

describe('retrieveCourseMiddleware', () => {
    test('sets response.locals.course', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => Promise.resolve(true));
        const findOne = jest.fn(() => ({ lean }));
        const courseModel = {
            findOne,
        };
        const courseId = 'abcd';
        const request: any = { params: { courseId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCourseMiddleware(courseModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: courseId });
        expect(response.locals.course).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws GetCourseNoCourseFound when solo streak is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn(() => Promise.resolve(false));
        const findOne = jest.fn(() => ({ lean }));
        const courseModel = {
            findOne,
        };
        const courseId = 'abcd';
        const request: any = { params: { courseId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCourseMiddleware(courseModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetCourseNoCourseFound));
    });

    test('calls next with RetrieveCourseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const lean = jest.fn(() => Promise.reject(errorMessage));
        const findOne = jest.fn(() => ({ lean }));
        const courseModel = {
            findOne,
        };
        const courseId = 'abcd';
        const request: any = { params: { courseId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCourseMiddleware(courseModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveCourseMiddleware, expect.any(Error)));
    });
});

describe('sendCourseMiddleware', () => {
    test('sends course', () => {
        expect.assertions(2);
        const send = jest.fn();
        const course = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { course }, send };
        const next = jest.fn();

        sendCourseMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(send).toBeCalledWith(course);
    });

    test('calls next with SendCourseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        await sendCourseMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendCourseMiddleware, expect.any(Error)));
    });
});

describe('getOneCourseMiddlewares', () => {
    test('that getCourseMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getOneCourseMiddlewares.length).toEqual(3);
        expect(getOneCourseMiddlewares[0]).toEqual(courseParamsValidationMiddleware);
        expect(getOneCourseMiddlewares[1]).toEqual(retrieveCourseMiddleware);
        expect(getOneCourseMiddlewares[2]).toEqual(sendCourseMiddleware);
    });
});
