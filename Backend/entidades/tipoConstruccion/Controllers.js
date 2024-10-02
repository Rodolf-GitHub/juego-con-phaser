const logger = require("../../loggers/loggers");
const XtipoConstruccion = require("./Models");

class XtipoConstruccionController {
  // Get all xtipoConstruccion
  async getAllXtipoConstruccion(req, res) {
    try {
      const xtipoConstruccions = await XtipoConstruccion.findAll();
      res.status(200).json(xtipoConstruccions);
    } catch (error) {
      logger.error("Error getting xtipoConstruccion:", error);
      res.status(500).json({ message: "Error getting xtipoConstruccion" });
    }
  }

  // Get xtipoConstruccion by ID
  async getXtipoConstruccionById(req, res) {
    const { id } = req.params;
    try {
      const xtipoConstruccion = await XtipoConstruccion.findByPk(id);
      if (!xtipoConstruccion) {
        return res.status(404).json({ message: "xtipoConstruccion not found" });
      }
      res.status(200).json(xtipoConstruccion);
    } catch (error) {
      logger.error("Error getting xtipoConstruccion by ID:", error);
      res.status(500).json({ message: "Error getting xtipoConstruccion by ID" });
    }
  }

  // Create xtipoConstruccion
  async createXtipoConstruccion(req, res) {
    const xtipoConstruccionData = await req.body;
    try {
      const newXtipoConstruccion = await XtipoConstruccion.create(xtipoConstruccionData);
      res.status(201).json(newXtipoConstruccion);
    } catch (error) {
      logger.error("Error creating xtipoConstruccion:", error);
      res.status(500).json({ message: "Error creating xtipoConstruccion" });
    }
  }

  // Update xtipoConstruccion
  async updateXtipoConstruccion(req, res) {
    const { id } = req.params;
    const xtipoConstruccionData = req.body;
    try {
      const xtipoConstruccion = await XtipoConstruccion.findByPk(id);
      if (!xtipoConstruccion) {
        return res.status(404).json({ message: "xtipoConstruccion not found" });
      }
      await xtipoConstruccion.update(xtipoConstruccionData);
      res.status(200).json(xtipoConstruccion);
    } catch (error) {
      logger.error("Error updating xtipoConstruccion:", error);
      res.status(500).json({ message: "Error updating xtipoConstruccion" });
    }
  }

  // Delete xtipoConstruccion
  async deleteXtipoConstruccion(req, res) {
    const { id } = req.params;
    try {
      const deletedXtipoConstruccion = await XtipoConstruccion.destroy({
        where: { id: id }
      });
      if (!deletedXtipoConstruccion) {
        return res.status(404).json({ message: "xtipoConstruccion not found" });
      }
      res.status(200).json({ message: "xtipoConstruccion successfully deleted" });
    } catch (error) {
      logger.error("Error deleting xtipoConstruccion:", error);
      res.status(500).json({ message: "Error deleting xtipoConstruccion" });
    }
  }
}

module.exports = XtipoConstruccionController;
