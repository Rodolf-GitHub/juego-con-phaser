const logger = require("../../loggers/loggers");
const Xconstruccion = require("./Models");
const Xterreno = require("../terreno/Models");

class XconstruccionController {
  // Get all xconstruccion
  async getAllXconstruccion(req, res) {
    try {
      const xconstruccions = await Xconstruccion.findAll();
      res.status(200).json(xconstruccions);
    } catch (error) {
      logger.error("Error getting xconstruccion:", error);
      res.status(500).json({ message: "Error getting xconstruccion" });
    }
  }

  // Get xconstruccion by ID
  async getXconstruccionById(req, res) {
    const { id } = req.params;
    try {
      const xconstruccion = await Xconstruccion.findByPk(id);
      if (!xconstruccion) {
        return res.status(404).json({ message: "xconstruccion not found" });
      }
      res.status(200).json(xconstruccion);
    } catch (error) {
      logger.error("Error getting xconstruccion by ID:", error);
      res.status(500).json({ message: "Error getting xconstruccion by ID" });
    }
  }

  // Create xconstruccion
  async createXconstruccion(req, res) {
    const xconstruccionData = await req.body;
    try {
      const newXconstruccion = await Xconstruccion.create(xconstruccionData);
      res.status(201).json(newXconstruccion);
    } catch (error) {
      logger.error("Error creating xconstruccion:", error);
      res.status(500).json({ message: "Error creating xconstruccion" });
    }
  }

  // Update xconstruccion
  async updateXconstruccion(req, res) {
    const { id } = req.params;
    const xconstruccionData = req.body;
    try {
      const xconstruccion = await Xconstruccion.findByPk(id);
      if (!xconstruccion) {
        return res.status(404).json({ message: "xconstruccion not found" });
      }
      await xconstruccion.update(xconstruccionData);
      res.status(200).json(xconstruccion);
    } catch (error) {
      logger.error("Error updating xconstruccion:", error);
      res.status(500).json({ message: "Error updating xconstruccion" });
    }
  }

  // Delete xconstruccion
  async deleteXconstruccion(req, res) {
    const { id } = req.params;
    try {
      const deletedXconstruccion = await Xconstruccion.destroy({
        where: { id: id }
      });
      if (!deletedXconstruccion) {
        return res.status(404).json({ message: "xconstruccion not found" });
      }
      res.status(200).json({ message: "xconstruccion successfully deleted" });
    } catch (error) {
      logger.error("Error deleting xconstruccion:", error);
      res.status(500).json({ message: "Error deleting xconstruccion" });
    }
  }

  async crearConstruccion(req, res) {
    const { tipoConstruccionId, x, y, terreno_id } = req.body;
    try {
      const terreno = await Xterreno.findByPk(terreno_id);
      if (!terreno) {
        return res.status(404).json({ message: "Terreno no encontrado" });
      }

      if (x < 0 || x >= terreno.ancho || y < 0 || y >= terreno.alto) {
        return res.status(400).json({ message: "Coordenadas fuera del terreno" });
      }

      const construccionExistente = await Xconstruccion.findOne({
        where: { terreno_id, x, y }
      });

      if (construccionExistente) {
        return res.status(400).json({ message: "Ya existe una construcción en esas coordenadas" });
      }

      const tipoConstruccion = await XtipoConstruccion.findByPk(tipoConstruccionId);
      if (!tipoConstruccion) {
        return res.status(404).json({ message: "Tipo de construcción no encontrado" });
      }

      const nuevaConstruccion = await Xconstruccion.create({
        nombre: tipoConstruccion.nombre,
        tipoConstruccionId,
        x,
        y,
        terreno_id,
        produccionOro: tipoConstruccion.produccionBase.oro,
        produccionMadera: tipoConstruccion.produccionBase.madera,
        produccionComida: tipoConstruccion.produccionBase.comida
      });

      res.status(201).json(nuevaConstruccion);
    } catch (error) {
      logger.error("Error al crear construcción:", error);
      res.status(500).json({ message: "Error al crear construcción" });
    }
  }

  async obtenerConstruccionesPorTerreno(req, res) {
    const { terreno_id } = req.params;
    try {
      const construcciones = await Xconstruccion.findAll({
        where: { terreno_id }
      });
      res.status(200).json(construcciones);
    } catch (error) {
      logger.error("Error al obtener construcciones:", error);
      res.status(500).json({ message: "Error al obtener construcciones" });
    }
  }

  async obtenerTiposConstruccion(req, res) {
    try {
      const tiposConstruccion = await XtipoConstruccion.findAll();
      res.status(200).json(tiposConstruccion);
    } catch (error) {
      logger.error("Error al obtener tipos de construcción:", error);
      res.status(500).json({ message: "Error al obtener tipos de construcción" });
    }
  }
}

module.exports = XconstruccionController;
