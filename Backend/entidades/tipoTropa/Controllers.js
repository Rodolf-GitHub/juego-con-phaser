const logger = require("../../loggers/loggers");
const XtipoTropa = require("./Models");

class XtipoTropaController {
  // Get all xtipoTropa
  async getAllXtipoTropa(req, res) {
    try {
      const xtipoTropas = await XtipoTropa.findAll();
      res.status(200).json(xtipoTropas);
    } catch (error) {
      logger.error("Error getting xtipoTropa:", error);
      res.status(500).json({ message: "Error getting xtipoTropa" });
    }
  }

  // Get xtipoTropa by ID
  async getXtipoTropaById(req, res) {
    const { id } = req.params;
    try {
      const xtipoTropa = await XtipoTropa.findByPk(id);
      if (!xtipoTropa) {
        return res.status(404).json({ message: "xtipoTropa not found" });
      }
      res.status(200).json(xtipoTropa);
    } catch (error) {
      logger.error("Error getting xtipoTropa by ID:", error);
      res.status(500).json({ message: "Error getting xtipoTropa by ID" });
    }
  }

  // Create xtipoTropa
  async createXtipoTropa(req, res) {
    const xtipoTropaData = await req.body;
    try {
      const newXtipoTropa = await XtipoTropa.create(xtipoTropaData);
      res.status(201).json(newXtipoTropa);
    } catch (error) {
      logger.error("Error creating xtipoTropa:", error);
      res.status(500).json({ message: "Error creating xtipoTropa" });
    }
  }

  // Update xtipoTropa
  async updateXtipoTropa(req, res) {
    const { id } = req.params;
    const xtipoTropaData = req.body;
    try {
      const xtipoTropa = await XtipoTropa.findByPk(id);
      if (!xtipoTropa) {
        return res.status(404).json({ message: "xtipoTropa not found" });
      }
      await xtipoTropa.update(xtipoTropaData);
      res.status(200).json(xtipoTropa);
    } catch (error) {
      logger.error("Error updating xtipoTropa:", error);
      res.status(500).json({ message: "Error updating xtipoTropa" });
    }
  }

  // Delete xtipoTropa
  async deleteXtipoTropa(req, res) {
    const { id } = req.params;
    try {
      const deletedXtipoTropa = await XtipoTropa.destroy({
        where: { id: id }
      });
      if (!deletedXtipoTropa) {
        return res.status(404).json({ message: "xtipoTropa not found" });
      }
      res.status(200).json({ message: "xtipoTropa successfully deleted" });
    } catch (error) {
      logger.error("Error deleting xtipoTropa:", error);
      res.status(500).json({ message: "Error deleting xtipoTropa" });
    }
  }
}

module.exports = XtipoTropaController;
