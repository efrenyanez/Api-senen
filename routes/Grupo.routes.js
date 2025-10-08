// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const GrupoController = require("../controller/Grupo.controller");

// 4.- Definir rutas

router.post("/guardarGrupo", GrupoController.guardar);
router.get("/listarGrupo", GrupoController.ListarTodos);
router.get("/buscarGrupo/:id", GrupoController.PlatillosPorId);
router.delete("/eliminarGrupo/:id", GrupoController.eliminarPlatillos);
router.patch("/actualizarGrupo/:id", GrupoController.actualizarPlatillos);

// 5.- Exportar rutas

module.exports = router;