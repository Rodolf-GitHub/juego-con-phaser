const logger = require("../../loggers/loggers");
const Xbase = require("./Models");

class XbaseController {
  // Get all xbase
  async getAllXbase(req, res) {
    try {
      const xbases = await Xbase.findAll();
      res.status(200).json(xbases);
    } catch (error) {
      logger.error("Error getting xbase:", error);
      res.status(500).json({ message: "Error getting xbase" });
    }
  }

  // Get xbase by ID
  async getXbaseById(req, res) {
    const { id } = req.params;
    try {
      const xbase = await Xbase.findByPk(id);
      if (!xbase) {
        return res.status(404).json({ message: "xbase not found" });
      }
      res.status(200).json(xbase);
    } catch (error) {
      logger.error("Error getting xbase by ID:", error);
      res.status(500).json({ message: "Error getting xbase by ID" });
    }
  }

  // Create xbase
  async createXbase(req, res) {
    const xbaseData = await req.body;
    try {
      const newXbase = await Xbase.create(xbaseData);
      res.status(201).json(newXbase);
    } catch (error) {
      logger.error("Error creating xbase:", error);
      res.status(500).json({ message: "Error creating xbase" });
    }
  }

  // Update xbase
  async updateXbase(req, res) {
    const { id } = req.params;
    const xbaseData = req.body;
    try {
      const xbase = await Xbase.findByPk(id);
      if (!xbase) {
        return res.status(404).json({ message: "xbase not found" });
      }
      await xbase.update(xbaseData);
      res.status(200).json(xbase);
    } catch (error) {
      logger.error("Error updating xbase:", error);
      res.status(500).json({ message: "Error updating xbase" });
    }
  }

  // Delete xbase
  async deleteXbase(req, res) {
    const { id } = req.params;
    try {
      const deletedXbase = await Xbase.destroy({
        where: { id: id }
      });
      if (!deletedXbase) {
        return res.status(404).json({ message: "xbase not found" });
      }
      res.status(200).json({ message: "xbase successfully deleted" });
    } catch (error) {
      logger.error("Error deleting xbase:", error);
      res.status(500).json({ message: "Error deleting xbase" });
    }
  }
}

module.exports = XbaseController;
