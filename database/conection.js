// database/conection.js
const mongoose = require('mongoose');

// Exportamos un objeto 'connections' que contendrá la conexión por defecto
// Esto mantiene compatibilidad con los modelos que llaman a db.connections.defaultConn
const connections = {
  defaultConn: null,
};

const connect = async (uri = 'mongodb://127.0.0.1:27017/mi_base_principal') => {
  try {
    if (mongoose.connection.readyState === 1) {
      connections.defaultConn = mongoose.connection;
      console.log('Ya conectado a MongoDB');
      return connections;
    }

    await mongoose.connect(uri, { });
    connections.defaultConn = mongoose.connection;
    console.log('Conectado a MongoDB principal');
    return connections;
  } catch (err) {
    console.error('Error al conectar a la BD:', err.message || err);
    throw err;
  }
};

module.exports = { connect, connections };
