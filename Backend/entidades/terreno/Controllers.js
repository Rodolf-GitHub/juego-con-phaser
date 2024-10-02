const logger = require("../../loggers/loggers");
const Xterreno = require("./Models");
const Xconstruccion = require("../construccion/Models");
const XtipoConstruccion = require("../tipoConstruccion/Models");

class XterrenoController {
  // Obtener todos los xterreno
  async getAllXterreno(req, res) {
    try {
      const xterrenos = await Xterreno.findAll();
      res.status(200).json(xterrenos);
    } catch (error) {
      logger.error("Error al obtener xterreno:", error);
      res.status(500).json({ message: "Error al obtener xterreno" });
    }
  }

  // Obtener xterreno por ID
  async getXterrenoById(req, res) {
    const { id } = req.params;
    try {
      const xterreno = await Xterreno.findByPk(id);
      if (!xterreno) {
        return res.status(404).json({ message: "xterreno no encontrado" });
      }
      res.status(200).json(xterreno);
    } catch (error) {
      logger.error("Error al obtener xterreno por ID:", error);
      res.status(500).json({ message: "Error al obtener xterreno por ID" });
    }
  }

  // Crear xterreno
  async createXterreno(req, res) {
    const xterrenoData = await req.body;
    try {
      const newXterreno = await Xterreno.create(xterrenoData);
      
      // Buscar el tipo de construcción "Ayuntamiento"
      const tipoAyuntamiento = await XtipoConstruccion.findOne({ where: { nombre: 'Ayuntamiento' } });
      
      if (!tipoAyuntamiento) {
        throw new Error("No se encontró el tipo de construcción 'Ayuntamiento'");
      }
      
      // Crear el Ayuntamiento en el centro del terreno
      await Xconstruccion.create({
        XterrenoId: newXterreno.id,
        XtipoConstruccionId: tipoAyuntamiento.id,
        x: Math.floor(newXterreno.ancho / 2),
        y: Math.floor(newXterreno.alto / 2),
        nivel: 1
      });

      res.status(201).json(newXterreno);
    } catch (error) {
      logger.error("Error al crear xterreno:", error);
      res.status(500).json({ message: "Error al crear xterreno" });
    }
  }

  // Actualizar xterreno
  async updateXterreno(req, res) {
    const { id } = req.params;
    const xterrenoData = req.body;
    try {
      const xterreno = await Xterreno.findByPk(id);
      if (!xterreno) {
        return res.status(404).json({ message: "xterreno no encontrado" });
      }
      await xterreno.update(xterrenoData);
      res.status(200).json(xterreno);
    } catch (error) {
      logger.error("Error al actualizar xterreno:", error);
      res.status(500).json({ message: "Error al actualizar xterreno" });
    }
  }

  // Eliminar xterreno
  async deleteXterreno(req, res) {
    const { id } = req.params;
    try {
      const deletedXterreno = await Xterreno.destroy({
        where: { id: id }
      });
      if (!deletedXterreno) {
        return res.status(404).json({ message: "xterreno no encontrado" });
      }
      res.status(200).json({ message: "xterreno eliminado exitosamente" });
    } catch (error) {
      logger.error("Error al eliminar xterreno:", error);
      res.status(500).json({ message: "Error al eliminar xterreno" });
    }
  }
}

module.exports = XterrenoController;
