import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Office Desk Booking API',
      version: '1.0.0',
      description: 'API documentation for the Office Desk Booking App'
    }
  },
  apis: ['./src/routes/*.ts'] // Path to the API docs (adjust to your file structure)
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
