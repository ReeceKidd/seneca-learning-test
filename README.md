# Seneca learning coding test.

The task is to create a simple mock of this service. Your stats service needs to provide the capability to create new stats as well as updating stats. The stats managed by the service are created and updated via HTTP calls. Stats are posted on the completion of a learning session and reflect how the user did on the learning session.

# Environment variables

NODE_ENV=test
PORT=3001
DATABASE_URI=mongodb://localhost:27017/seneca

# How to run

Ensure you have a local version of mongo db running.

npm run dev: To start server

npm run unit-tests: For unit tests.

npm run integration-tests: Runs an integration test for each of the routes defined in the YML file. No need
to start the server as supertest will start a server for each of the tests.

# Design thoughts

I relied heavily on middlewares to ensure the architecture is flexible enough to be adapted quickly with further clarification around the requirements.

Joi validation could be improved throughout to check if the ID parameter's follow the rules of the UUID.

Had to create some additional routes for the integration tests like POST /course could have achieved this directly by accessing the mongoose model but that felt incomplete.

Would have liked to do more work on the integration test SDK but it didn't seem relevant for the task.

With more time I would write more integration/acceptance tests around edge cases.
