module.exports = {
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    // globalSetup: './__tests__/jest.setup.cjs'
    setupFiles: ['./__tests__/jest.setup.cjs']
};