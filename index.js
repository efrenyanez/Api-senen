const express = require('express');
const cors = require('cors');
const db = require('./database/conection');

// Rutas
const ConciertoRoutes = require('./routes/Concierto.routes');
const ConferenciasRoutes = require('./routes/Conferencias.routes');
const CulturalRoutes = require('./routes/Cultural.routes');
const DeportesRoutes = require('./routes/Deportes.routes');
const GrupoRoutes = require('./routes/Grupo.routes');
const ParticipantesRoutes = require('./routes/Participantes.routes');
const PonenteRoutes = require('./routes/Ponente.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Senen - servidor en funcionamiento' });
});

// Montar rutas bajo /api
app.use('/api', ConciertoRoutes);
app.use('/api', ConferenciasRoutes);
app.use('/api', CulturalRoutes);
app.use('/api', DeportesRoutes);
app.use('/api', GrupoRoutes);
app.use('/api', ParticipantesRoutes);
app.use('/api', PonenteRoutes);

const PORT = process.env.PORT || 3000;

// Iniciar conexiones y servidor
const start = async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
      console.log('Conexiones a las bases de datos inicializadas.');
    });
  } catch (err) {
    console.error('No se pudo iniciar la aplicación:', err.message);
    process.exit(1);
  }
};

start();
