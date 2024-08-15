# Beat App: Back End

The back-end project is focused on creating a server for the Beat Application. Key features API Endpoints: Implement RESTful API endpoints to facilitate data retreival, creation, updating & deletion for the Beat Application. Database integration with a database to store & manage application data effficiently. User authorization and authorization mechanisms to ensure secure access to the applications resources.

## Running the project

npm run dev - to launch the server with the hot reload feature.

npm run start - to launch the server

## Technologies Used

Node.js: Used as the runtime environment for the server-side application.

Express: Employed as the web application framework to build a robust & scalable API's.

MongoDB: Chosed as the database to store and manage application data effectively.

JWT(JSON Web Tokens): Implemented for the user authentication and authorization.

## Security Measures

Helmet: Used to secure Express apps by setting vaious HTTP headers.

bcrypt: Employed for hashing and salting passwords to enhance security.

CORS: Implemented CORS middleware to handle cross-origin resource sharing.

## Other Tools & Libraries

Mongoose: Used as an ODM (Object Data Modeling) library for MongoDB to simplify interactions with the database.

Dotenv: Used for the managing environment variables and configuration settings.

Joi & Celebrate: Used for an express middleware function that wraps the joi validation library.

Winston: Used for a simple and universal logging library with support for multiple transports.

ExpressWinston: Provides middleware for request and error logging of your express.js application.

## Front-End Domain

https://beatapp.strangled.net

## Back-End Domain

https://api.beatapp.strangled.net
