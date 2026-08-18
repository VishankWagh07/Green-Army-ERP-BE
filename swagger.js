import swaggerAutogen from 'swagger-autogen';


const doc = {
  info: {
    title: 'Green Army ERP API',
    description: 'Automatically generated documentation'
  },
  host: 'localhost:5000',
  basePath: '/'
};

const outputFile = './swagger-output.json';
const routes = ['./src/server.js',];

swaggerAutogen()(outputFile, routes, doc);