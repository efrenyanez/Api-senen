// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const DeportesController = require("../controller/Deportes.controller");

// 4.- Definir rutas

router.post("/guardarDeportes", DeportesController.guardar);
router.get("/listarDeportes", DeportesController.ListarTodos);
router.get("/buscarDeportes/:id", DeportesController.PlatillosPorId);
router.delete("/eliminarDeportes/:id", DeportesController.eliminarPlatillos);
router.patch("/actualizarDeportes/:id", DeportesController.actualizarPlatillos);

// 5.- Exportar rutas

module.exports = router;