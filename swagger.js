const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger.json";
const endpointsFiles = ["index.js"];

const doc = {
  info: {
    title: "API de Eventos",
    description: "Esta es una api de eventos"
  },
  host: "localhost:3690",
  schemes: ["http"]
};

swaggerAutogen(outputFile, endpointsFiles, doc);
