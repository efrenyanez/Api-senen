// 1.- importar express

const express = require('express');

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const EquiposController = require('../controller/Equipos.controller');

// 4.- Definir rutas

router.post('/guardarEquipos', EquiposController.guardar);
router.get('/listarEquipos', EquiposController.ListarTodos);
router.get('/buscarEquipos/:id', EquiposController.PlatillosPorId);
router.delete('/eliminarEquipos/:id', EquiposController.eliminarPlatillos);
router.patch('/actualizarEquipos/:id', EquiposController.actualizarPlatillos);

// 5.- Exportar rutas

module.exports = router;
