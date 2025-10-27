//Dependencias principales
const express = require("express");
const cors = require("cors");
const db = require("./database/conection");


//Importar rutas
const ConciertoRoutes = require("./routes/Concierto.routes");
const ConferenciasRoutes = require("./routes/Conferencias.routes");
const CulturalRoutes = require("./routes/Cultural.routes");
const DeportesRoutes = require("./routes/Deportes.routes");
const GrupoRoutes = require("./routes/Grupo.routes");
const ParticipantesRoutes = require("./routes/Participantes.routes");
const PonentesRoutes = require("./routes/Ponente.routes");
const EquiposRoutes = require("./routes/Equipos.routes");

//Inicializar app
const app = express();

//Swagger (documentación API)
const swaggerUI = require("swagger-ui-express");
const swaggerDocumentation = require("./swagger.json");

app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta base de verificación
app.get("/", (req, res) => {
  res.json({ mensaje: "✅ API Senen - Servidor en funcionamiento" });
});

//Montar rutas de módulos
app.use("/api/conciertos", ConciertoRoutes);
app.use("/api/conferencias", ConferenciasRoutes);
app.use("/api/cultural", CulturalRoutes);
app.use("/api/deportes", DeportesRoutes);
app.use("/api/grupos", GrupoRoutes);
app.use("/api/participantes", ParticipantesRoutes);
app.use("/api/ponentes", PonentesRoutes);
app.use("/api/equipos", EquiposRoutes);


//Inicializar servidor
const PORT = process.env.PORT || 3690;

const start = async () => {
  try {
    await db.connect(); // Conecta ambas bases (defaultConn y teamsConn)
    app.listen(PORT, () => {
      console.log(` Servidor corriendo en: http://localhost:${PORT}`);
      //console.log("Bases de datos conectadas correctamente");
      //console.log("Documentación: http://localhost:" + PORT + "/doc");
    });
  } catch (err) {
    console.error("No se pudo iniciar la aplicación:", err.message);
    process.exit(1);
  }
};

start();
