// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const GrupoController = require("../controller/Grupo.controller");

// 4.- Definir rutas

router.post("/guardarGrupo", GrupoController.guardarGrupo);
router.get("/listarGrupo", GrupoController.listarGrupos);
router.get("/buscarGrupo/:id", GrupoController.obtenerGrupoPorId);
router.delete("/eliminarGrupo/:id", GrupoController.eliminarGrupo);
router.patch("/actualizarGrupo/:id", GrupoController.actualizarGrupo);

// 5.- Exportar rutas

module.exports = router;