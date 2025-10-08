// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const PonentesController = require("../controller/Ponentes.controller");

// 4.- Definir rutas

router.post("/guardarPonentes", PonentesController.guardar);
router.get("/listarPonentes", PonentesController.ListarTodos);
router.get("/buscarPonentes/:id", PonentesController.PlatillosPorId);
router.delete("/eliminarPonentes/:id", PonentesController.eliminarPlatillos);
router.patch("/actualizarPonentes/:id", PonentesController.actualizarPlatillos);

// 5.- Exportar rutas

module.exports = router;