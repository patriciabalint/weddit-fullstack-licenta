import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Design from '../models/designModel.js';
const designRouter = express.Router();

// Rută pentru salvarea/actualizarea designului
designRouter.post('/save', authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId; // userId vine de la middleware-ul de autentificare
    const { productId, fields } = req.body;

    // Validare simplă
    if (!userId || !productId || !fields) {
      return res.json({
        success: false,
        message: 'Date insuficiente pentru salvarea designului.',
      });
    }

    // Căutăm un design existent pentru user și produs
    // findOneAndUpdate va căuta un document care se potrivește cu criteriile
    // dacă nu-l găsește, îl va crea (opțiunea upsert: true)
    const design = await Design.findOneAndUpdate(
      { userId: userId, productId: productId },
      { fields: fields, updatedAt: Date.now() }, // Setăm noile câmpuri și data actualizării
      { new: true, upsert: true, setDefaultsOnInsert: true } // new: true returnează documentul modificat, upsert: true creează dacă nu există
    );

    res.json({
      success: true,
      message: 'Design salvat cu succes!',
      designId: design._id,
    });
  } catch (error) {
    console.error('Eroare la salvarea designului:', error);
    res.json({ success: false, message: 'Eroare la salvarea designului.' });
  }
});

// Rută pentru încărcarea designului
designRouter.post('/load', authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId; // userId vine de la middleware-ul de autentificare
    const { productId } = req.body;

    // Validare
    if (!userId || !productId) {
      return res.json({
        success: false,
        message: 'Date insuficiente pentru încărcarea designului.',
      });
    }

    const design = await Design.findOne({
      userId: userId,
      productId: productId,
    });

    if (design) {
      res.json({ success: true, fields: design.fields });
    } else {
      // Dacă nu găsim un design, trimitem un array gol sau o stare default
      res.json({
        success: true,
        fields: [],
        message: 'Nu s-a găsit niciun design salvat pentru acest produs.',
      });
    }
  } catch (error) {
    console.error('Eroare la încărcarea designului:', error);
    res.json({ success: false, message: 'Eroare la încărcarea designului.' });
  }
});

export default designRouter;
