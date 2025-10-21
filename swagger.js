const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger.json";
const endpointsFiles = ['index.js'];

const doc = {
  info: {
    title: "API de platillos tipicos",
    description: "Esta API muestra diferentes platillos tipicos"
  },
  host: "localhost:3690",
  schemes: ["http"]
};

swaggerAutogen(outputFile, endpointsFiles, doc);
