const swaggerJsdoc = require('swagger-jsdoc');
require("dotenv").config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduConnect API Documentation',
      version: '1.0.0',
      description: 'Swagger API docs for EduConnect project',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api`, 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./routers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;