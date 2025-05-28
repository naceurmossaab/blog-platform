const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API Docs',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication routes',
      },
      {
        name: 'Users',
        description: 'User management',
      },
      {
        name: 'Articles',
        description: 'Article management',
      },
    ],
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.route.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
