const logger = require("../../loggers/loggers");
const Xbatalla = require("./Models");
const Xtropa = require("../tropa/Models");
const Xconstruccion = require("../construccion/Models");
const User = require("../user/Models");

class XbatallaController {
  // Get all xbatalla
  async getAllXbatalla(req, res) {
    try {
      const xbatallas = await Xbatalla.findAll();
      res.status(200).json(xbatallas);
    } catch (error) {
      logger.error("Error getting xbatalla:", error);
      res.status(500).json({ message: "Error getting xbatalla" });
    }
  }

  // Get xbatalla by ID
  async getXbatallaById(req, res) {
    const { id } = req.params;
    try {
      const xbatalla = await Xbatalla.findByPk(id);
      if (!xbatalla) {
        return res.status(404).json({ message: "xbatalla not found" });
      }
      res.status(200).json(xbatalla);
    } catch (error) {
      logger.error("Error getting xbatalla by ID:", error);
      res.status(500).json({ message: "Error getting xbatalla by ID" });
    }
  }

  // Create xbatalla
  async createXbatalla(req, res) {
    const xbatallaData = await req.body;
    try {
      const newXbatalla = await Xbatalla.create(xbatallaData);
      res.status(201).json(newXbatalla);
    } catch (error) {
      logger.error("Error creating xbatalla:", error);
      res.status(500).json({ message: "Error creating xbatalla" });
    }
  }

  // Update xbatalla
  async updateXbatalla(req, res) {
    const { id } = req.params;
    const xbatallaData = req.body;
    try {
      const xbatalla = await Xbatalla.findByPk(id);
      if (!xbatalla) {
        return res.status(404).json({ message: "xbatalla not found" });
      }
      await xbatalla.update(xbatallaData);
      res.status(200).json(xbatalla);
    } catch (error) {
      logger.error("Error updating xbatalla:", error);
      res.status(500).json({ message: "Error updating xbatalla" });
    }
  }

  // Delete xbatalla
  async deleteXbatalla(req, res) {
    const { id } = req.params;
    try {
      const deletedXbatalla = await Xbatalla.destroy({
        where: { id: id }
      });
      if (!deletedXbatalla) {
        return res.status(404).json({ message: "xbatalla not found" });
      }
      res.status(200).json({ message: "xbatalla successfully deleted" });
    } catch (error) {
      logger.error("Error deleting xbatalla:", error);
      res.status(500).json({ message: "Error deleting xbatalla" });
    }
  }

  async iniciarBatalla(req, res) {
    const { atacanteId, defensorId, tropasAtacante } = req.body;
    try {
      const atacante = await User.findByPk(atacanteId, { include: ['Xterreno'] });
      const defensor = await User.findByPk(defensorId, { include: ['Xterreno'] });

      if (!atacante || !defensor) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const defensasDefensor = await Xconstruccion.findAll({
        where: { terreno_id: defensor.Xterreno.id, tipo: 'defensa' }
      });

      const resultado = this.calcularResultadoBatalla(tropasAtacante, defensasDefensor);

      const batalla = await Xbatalla.create({
        atacanteId,
        defensorId,
        resultado: resultado.ganador,
        detalles: JSON.stringify(resultado.detalles)
      });

      res.status(201).json(batalla);
    } catch (error) {
      console.error("Error al iniciar batalla:", error);
      res.status(500).json({ message: "Error al iniciar batalla" });
    }
  }

  calcularResultadoBatalla(tropasAtacante, defensasDefensor) {
    let poderAtacante = tropasAtacante.reduce((total, tropa) => total + tropa.ataque, 0);
    let poderDefensor = defensasDefensor.reduce((total, defensa) => total + defensa.defensa, 0);

    const detalles = {
      rondas: [],
      tropasPerdidasAtacante: 0,
      defensasDestruidasDefensor: 0
    };

    while (poderAtacante > 0 && poderDefensor > 0) {
      const dañoAtacante = Math.floor(Math.random() * poderAtacante);
      const dañoDefensor = Math.floor(Math.random() * poderDefensor);

      poderDefensor -= dañoAtacante;
      poderAtacante -= dañoDefensor;

      detalles.rondas.push({ dañoAtacante, dañoDefensor });
      detalles.tropasPerdidasAtacante += dañoDefensor;
      detalles.defensasDestruidasDefensor += dañoAtacante;
    }

    const ganador = poderAtacante > poderDefensor ? 'atacante' : 'defensor';

    return { ganador, detalles };
  }
}

module.exports = XbatallaController;
