import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Design from '../models/designModel.js';

const designRouter = express.Router();

designRouter.post('/save', authMiddleware, async (req, res) => {
  const userId = req.user?.id || req.userId;
  const { productId, designData } = req.body;

  if (!userId || !productId || !designData) {
    return res.status(400).json({
      success: false,
      message: 'Date insuficiente pentru salvarea designului.',
    });
  }

  try {
    const design = await Design.findOneAndUpdate(
      { userId, productId },
      { designData, hasBeenEdited: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Design salvat cu succes!',
      designId: design._id,
    });
  } catch (error) {
    console.error('Eroare la salvarea designului:', error);
    res
      .status(500)
      .json({ success: false, message: 'Eroare la salvarea designului.' });
  }
});

designRouter.post('/load', authMiddleware, async (req, res) => {
  const userId = req.user?.id || req.userId;
  const { productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      message: 'Date insuficiente pentru încărcarea designului.',
    });
  }

  try {
    const design = await Design.findOne({ userId, productId });

    if (design) {
      res.status(200).json({
        success: true,
        designData: design.designData,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Nu s-a găsit niciun design salvat pentru acest produs.',
      });
    }
  } catch (error) {
    console.error('Eroare la încărcarea designului:', error);
    res
      .status(500)
      .json({ success: false, message: 'Eroare la încărcarea designului.' });
  }
});

export default designRouter;
