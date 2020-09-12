const isTestEnvironment = (): boolean => {
    if (process.env.NODE_ENV === 'test') return true;
    throw new Error('Not test environment');
};

export { isTestEnvironment };
