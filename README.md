# Seneca learning coding test.

The task is to create a simple mock of this service. Your stats service needs to provide the capability to create new stats as well as updating stats. The stats managed by the service are created and updated via HTTP calls. Stats are posted on the completion of a learning session and reflect how the user did on the learning session.

# Environment variables

NODE_ENV=

PORT=

DATABASE_URI=

# Design thoughts

I would have made the POST-course/{courseId} route course/{courseId}/study-session but this could be a lack of understanding on my part. I was unsure what resource was being created from reading the route. An abstraction might be required StudyEvent for example.

I would add additional validation to the creation of a course session. Such as checking if the course Id exists in the database and non negative number checks for the body parameters.
