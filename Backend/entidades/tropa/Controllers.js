const logger = require("../../loggers/loggers");
const Xtropa = require("./Models");

class XtropaController {
  // Get all xtropa
  async getAllXtropa(req, res) {
    try {
      const xtropas = await Xtropa.findAll();
      res.status(200).json(xtropas);
    } catch (error) {
      logger.error("Error getting xtropa:", error);
      res.status(500).json({ message: "Error getting xtropa" });
    }
  }

  // Get xtropa by ID
  async getXtropaById(req, res) {
    const { id } = req.params;
    try {
      const xtropa = await Xtropa.findByPk(id);
      if (!xtropa) {
        return res.status(404).json({ message: "xtropa not found" });
      }
      res.status(200).json(xtropa);
    } catch (error) {
      logger.error("Error getting xtropa by ID:", error);
      res.status(500).json({ message: "Error getting xtropa by ID" });
    }
  }

  // Create xtropa
  async createXtropa(req, res) {
    const xtropaData = await req.body;
    try {
      const newXtropa = await Xtropa.create(xtropaData);
      res.status(201).json(newXtropa);
    } catch (error) {
      logger.error("Error creating xtropa:", error);
      res.status(500).json({ message: "Error creating xtropa" });
    }
  }

  // Update xtropa
  async updateXtropa(req, res) {
    const { id } = req.params;
    const xtropaData = req.body;
    try {
      const xtropa = await Xtropa.findByPk(id);
      if (!xtropa) {
        return res.status(404).json({ message: "xtropa not found" });
      }
      await xtropa.update(xtropaData);
      res.status(200).json(xtropa);
    } catch (error) {
      logger.error("Error updating xtropa:", error);
      res.status(500).json({ message: "Error updating xtropa" });
    }
  }

  // Delete xtropa
  async deleteXtropa(req, res) {
    const { id } = req.params;
    try {
      const deletedXtropa = await Xtropa.destroy({
        where: { id: id }
      });
      if (!deletedXtropa) {
        return res.status(404).json({ message: "xtropa not found" });
      }
      res.status(200).json({ message: "xtropa successfully deleted" });
    } catch (error) {
      logger.error("Error deleting xtropa:", error);
      res.status(500).json({ message: "Error deleting xtropa" });
    }
  }
}

module.exports = XtropaController;
