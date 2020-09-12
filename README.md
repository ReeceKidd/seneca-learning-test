# Seneca learning coding test.

The task is to create a simple mock of this service. Your stats service needs to provide the capability to create new stats as well as updating stats. The stats managed by the service are created and updated via HTTP calls. Stats are posted on the completion of a learning session and reflect how the user did on the learning session.

# Environment variables

NODE_ENV=test
PORT=3001
DATABASE_URI=mongodb://localhost:27017/seneca

# Design thoughts

I would have made the POST-course/{courseId} route course/{courseId}/study-session but this could be a lack of understanding on my part. I was unsure what resource was being created from reading the route. An abstraction might be required StudyEvent for example.

I would add additional validation to the creation of a course session. Such as checking if the course Id exists in the database and non negative number checks for the body parameters.

Inside of POST-course/{courseId} I choose to create a SESSION and update the COURSE document stats as this meant I didn't have to do any computation with the GET request.

Had to create some additional routes for the integration tests like POST /course could have achieved this directly by accessing the mongoose model but that felt incomplete.

Would have liked to do more work on the integration test SDK but it didn't seem relevant for the task.

Joi validation could be improved throughout to check if the ID parameter's follow the rules of the UUID.

I could have created another resource abstraction for CourseSession to clean up the organization of the RouteMiddlewares folder.
