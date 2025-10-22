const mongoose = require("mongoose");
const db = require("../database/conection");
const ConciertosModel = require("../models/conciertos.model");

const ensureConnected = async () => {
  if (!db.connections.defaultConn) {
    await db.connect();
  }
};

module.exports = {
  guardarConcierto: async (req, res) => {
    try {
      await ensureConnected();
      const {
        nombre,
        artistaPrincipal,
        artistasInvitados,
        descripcion,
        generoMusical,
        fecha,
        horaInicio,
        horaFin,
        lugar,
        direccion,
        ciudad,
        pais,
        precioMinimo,
        precioMaximo,
        moneda,
        boletosDisponibles,
        organizador,
        grupos,
        participantes
      } = req.body;

      // Validar campos obligatorios
      const faltantes = [];
      if (!nombre) faltantes.push('nombre');
      if (!artistaPrincipal) faltantes.push('artistaPrincipal');
      if (!generoMusical) faltantes.push('generoMusical');
      if (!fecha) faltantes.push('fecha');
      if (!horaInicio) faltantes.push('horaInicio');
      if (!horaFin) faltantes.push('horaFin');
      if (!lugar) faltantes.push('lugar');
      if (!direccion) faltantes.push('direccion');
      if (!ciudad) faltantes.push('ciudad');
      if (!pais) faltantes.push('pais');
      if (precioMinimo === undefined) faltantes.push('precioMinimo');
      if (precioMaximo === undefined) faltantes.push('precioMaximo');
      if (!moneda) faltantes.push('moneda');
      if (boletosDisponibles === undefined) faltantes.push('boletosDisponibles');
      if (!organizador) faltantes.push('organizador');

      if (faltantes.length) {
        return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios', faltantes });
      }

      const Model = ConciertosModel.getModel();
      const nuevo = new Model({
        nombre,
        artistaPrincipal,
        artistasInvitados,
        descripcion,
        generoMusical,
        fecha,
        horaInicio,
        horaFin,
        lugar,
        direccion,
        ciudad,
        pais,
        precioMinimo,
        precioMaximo,
        moneda,
        boletosDisponibles,
        organizador,
        grupos,
        participantes
      });

      const saved = await nuevo.save();
      return res.status(201).json({ status: 'success', message: 'Concierto guardado', data: saved });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando concierto", error: err.message });
    }
  },
  listarConciertos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ConciertosModel.getModel();
      // Asegurar que el modelo Grupo esté registrado en la conexión por defecto
      try { require('../models/grupo.model').getModel(); } catch (e) { /* ignore */ }

      // populate solo grupos (mismo connection/defaultConn). Participantes están en teamsConn
      const items = await Model.find().populate('grupos').lean();

      // Recolectar todos los participantes para cargarlos desde teamsConn
      const allParticipantIds = items.reduce((acc, it) => {
        if (Array.isArray(it.participantes) && it.participantes.length) acc.push(...it.participantes.map(String));
        return acc;
      }, []);
      if (allParticipantIds.length) {
        try {
          const ParticipantesModel = require('../models/participantes.model').getModel();
          const parts = await ParticipantesModel.find({ _id: { $in: allParticipantIds } }).lean();
          const partsById = parts.reduce((m,p)=>{ m[p._id.toString()] = p; return m; },{});
          items.forEach(it=>{ if (Array.isArray(it.participantes)) it.participantes = it.participantes.map(id=> partsById[id.toString()] || id); });
        } catch(e) {
          console.warn('No se pudieron cargar participantes (cross-db):', e.message);
        }
      }

      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando conciertos", error: err.message });
    }
  },
  obtenerConciertoPorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ConciertosModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      try { require('../models/grupo.model').getModel(); } catch (e) { /* ignore */ }
      const item = await Model.findById(req.params.id).populate('grupos').lean();
      if (!item) return res.status(404).json({ message: "No encontrado" });

      if (item && Array.isArray(item.participantes) && item.participantes.length) {
        try {
          const ParticipantesModel = require('../models/participantes.model').getModel();
          const parts = await ParticipantesModel.find({ _id: { $in: item.participantes } }).lean();
          const partsById = parts.reduce((m,p)=>{ m[p._id.toString()] = p; return m; },{});
          item.participantes = item.participantes.map(id=> partsById[id.toString()] || id);
        } catch(e) {
          console.warn('No se pudieron cargar participantes (cross-db):', e.message);
        }
      }

      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando concierto", error: err.message });
    }
  },
  eliminarConcierto: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ConciertosModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando concierto", error: err.message });
    }
  },
  actualizarConcierto: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ConciertosModel.getModel();
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'error', message: 'ID inválido' });

      const {
        nombre,
        artistaPrincipal,
        artistasInvitados,
        descripcion,
        generoMusical,
        fecha,
        horaInicio,
        horaFin,
        lugar,
        direccion,
        ciudad,
        pais,
        precioMinimo,
        precioMaximo,
        moneda,
        boletosDisponibles,
        organizador,
        grupos,
        participantes
      } = req.body;

      if (!nombre && !artistaPrincipal && !artistasInvitados && !descripcion && !generoMusical && !fecha && !horaInicio && !horaFin && !lugar && !direccion && !ciudad && !pais && precioMinimo === undefined && precioMaximo === undefined && !moneda && boletosDisponibles === undefined && !organizador && !grupos && !participantes) {
        return res.status(400).json({ status: 'error', message: 'Debe proporcionar al menos un campo para actualizar' });
      }

      const datosActualizar = {};
      if (nombre) datosActualizar.nombre = nombre;
      if (artistaPrincipal) datosActualizar.artistaPrincipal = artistaPrincipal;
      if (artistasInvitados) datosActualizar.artistasInvitados = artistasInvitados;
      if (descripcion) datosActualizar.descripcion = descripcion;
      if (generoMusical) datosActualizar.generoMusical = generoMusical;
      if (fecha) datosActualizar.fecha = fecha;
      if (horaInicio) datosActualizar.horaInicio = horaInicio;
      if (horaFin) datosActualizar.horaFin = horaFin;
      if (lugar) datosActualizar.lugar = lugar;
      if (direccion) datosActualizar.direccion = direccion;
      if (ciudad) datosActualizar.ciudad = ciudad;
      if (pais) datosActualizar.pais = pais;
      if (precioMinimo !== undefined) datosActualizar.precioMinimo = precioMinimo;
      if (precioMaximo !== undefined) datosActualizar.precioMaximo = precioMaximo;
      if (moneda) datosActualizar.moneda = moneda;
      if (boletosDisponibles !== undefined) datosActualizar.boletosDisponibles = boletosDisponibles;
      if (organizador) datosActualizar.organizador = organizador;
      if (grupos) datosActualizar.grupos = grupos;
      if (participantes) datosActualizar.participantes = participantes;

      const updated = await Model.findByIdAndUpdate(id, datosActualizar, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ status: 'error', message: 'Concierto no encontrado' });
      return res.status(200).json({ status: 'success', message: 'Concierto actualizado correctamente', data: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando concierto", error: err.message });
    }
  },
};
