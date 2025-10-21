const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger.json";
// incluir index + rutas para que swagger-autogen detecte todos los endpoints
const endpointsFiles = [
  'index.js',
  './routes/*.js',
  './controller/*.js'
];

const doc = {
  info: {
    title: "API Senen",
    description: "API para gestión de eventos, equipos y participantes"
  },
  host: "localhost:3690",
  schemes: ["http"],
  // definiciones / ejemplos para que Swagger muestre el body en POST/PATCH
  definitions: {
    Participante: {
      nombre: "Ana",
      apellido: "López",
      email: "ana.lopez@example.com",
      telefono: "+5215512345678",
      tipo: "asistente",
      equipo: "60f1a2b3c4d5e6f7890abc12"
    },
    Equipo: {
      nombre: "Equipo A",
      pais: "México",
      descripcion: "Equipo de ejemplo",
      integrantes: ["60f1a2b3c4d5e6f7890abc31"]
    },
    Concierto: {
      nombre: "Noche de Rock",
      artistaPrincipal: "La Banda X",
      artistasInvitados: ["Banda Y"],
      descripcion: "Concierto al aire libre",
      generoMusical: "Rock",
      fecha: "2025-11-15T20:00:00.000Z",
      horaInicio: "20:00",
      horaFin: "23:30",
      lugar: "Auditorio Central",
      direccion: "Av. Principal 123",
      ciudad: "Ciudad",
      pais: "México",
      precioMinimo: 200,
      precioMaximo: 700,
      moneda: "MXN",
      boletosDisponibles: 500,
      organizador: "Organización X",
      grupos: ["60f1a2b3c4d5e6f7890abc21"],
      participantes: ["60f1a2b3c4d5e6f7890abc31"]
    }
  }
};

// Añadir paths explícitos para que los bodies aparezcan en Swagger UI (swagger 2.0 uses 'parameters' with in: 'body')
doc.paths = doc.paths || {};

const bodyParam = (name, ref) => ([
  { name: name, in: 'body', required: true, schema: { $ref: `#/definitions/${ref}` } }
]);

// Conciertos
doc.paths['/api/guardarConcierto'] = { post: { parameters: bodyParam('body', 'Concierto'), responses: { '201': { description: 'Created' }, '500': { description: 'Internal Server Error' } } } };
doc.paths['/api/actualizarConcierto/{id}'] = { patch: { parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ].concat(bodyParam('body','Concierto')), responses: { '200': { description: 'OK' } } } };

// Conferencias
doc.paths['/api/guardarConferencia'] = { post: { parameters: bodyParam('body','Participante'), responses: { '201': { description: 'Created' } } } };
doc.paths['/api/actualizarConferencia/{id}'] = { patch: { parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ].concat(bodyParam('body','Participante')), responses: { '200': { description: 'OK' } } } };

// Cultural
doc.paths['/api/guardarCultural'] = { post: { parameters: bodyParam('body','Participante'), responses: { '201': { description: 'Created' } } } };
doc.paths['/api/actualizarCultural/{id}'] = { patch: { parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ].concat(bodyParam('body','Participante')), responses: { '200': { description: 'OK' } } } };

// Deportes
doc.paths['/api/guardarDeportes'] = { post: { parameters: bodyParam('body','Equipo'), responses: { '201': { description: 'Created' } } } };
doc.paths['/api/actualizarDeportes/{id}'] = { patch: { parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ].concat(bodyParam('body','Equipo')), responses: { '200': { description: 'OK' } } } };

// Grupo
doc.paths['/api/guardarGrupo'] = { post: { parameters: bodyParam('body','Equipo'), responses: { '201': { description: 'Created' } } } };
doc.paths['/api/actualizarGrupo/{id}'] = { patch: { parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ].concat(bodyParam('body','Equipo')), responses: { '200': { description: 'OK' } } } };

// Participantes
doc.paths['/api/guardarParticipantes'] = { post: { parameters: bodyParam('body','Participante'), responses: { '201': { description: 'Created' } } } };
doc.paths['/api/actualizarParticipantes/{id}'] = { patch: { parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ].concat(bodyParam('body','Participante')), responses: { '200': { description: 'OK' } } } };

// Ponentes
doc.paths['/api/guardarPonente'] = { post: { parameters: bodyParam('body','Participante'), responses: { '201': { description: 'Created' } } } };
doc.paths['/api/actualizarPonente/{id}'] = { patch: { parameters: [ { name: 'id', in: 'path', required: true, type: 'string' } ].concat(bodyParam('body','Participante')), responses: { '200': { description: 'OK' } } } };

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  // Post-procesamiento: inyectar parámetros 'body' para endpoints comunes
  const fs = require('fs');
  const path = require('path');
  const swaggerPath = path.resolve(__dirname, outputFile);
  try {
    const raw = fs.readFileSync(swaggerPath, 'utf8');
    const spec = JSON.parse(raw);

    const mapDef = (p) => {
      if (/Concierto/i.test(p)) return 'Concierto';
      if (/Participantes|Participante/i.test(p)) return 'Participante';
      if (/Deportes|Deporte/i.test(p)) return 'Equipo';
      if (/Grupo/i.test(p)) return 'Equipo';
      if (/Ponente|Ponentes/i.test(p)) return 'Participante';
      if (/Conferencia/i.test(p)) return 'Participante';
      if (/Cultural/i.test(p)) return 'Participante';
      return 'Participante';
    };

    Object.keys(spec.paths || {}).forEach((p) => {
      const item = spec.paths[p];
      ['post', 'patch'].forEach((m) => {
        if (item[m]) {
          const hasBody = (item[m].parameters || []).some(pr => pr.in === 'body');
          if (!hasBody) {
            const def = mapDef(p);
            item[m].parameters = item[m].parameters || [];
            item[m].parameters.push({ name: 'body', in: 'body', required: true, schema: { $ref: `#/definitions/${def}` } });
          }
        }
      });
    });

    fs.writeFileSync(swaggerPath, JSON.stringify(spec, null, 2));
    console.log('swagger.json actualizado con parámetros body');
  } catch (e) {
    console.error('Error post-procesando swagger.json:', e.message || e);
  }
});
