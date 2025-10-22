const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger.json";
const endpointsFiles = ["index.js"];

const doc = {
  info: {
    title: "API de prueba",
    description: "Esta es una prueba de swagger"
  },
  host: "localhost:3690",
  schemes: ["http"]
};

swaggerAutogen(outputFile, endpointsFiles, doc);
