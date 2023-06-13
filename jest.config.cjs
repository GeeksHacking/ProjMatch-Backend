module.exports = {
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    preset: '@shelf/jest-mongodb',
    globalSetup: './__tests__/jest.setup.cjs'
};