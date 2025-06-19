import Design from '../models/designModel.js';

const saveDesign = async (req, res) => {
  const { productId, designData } = req.body;
  const userId = req.user?.id || req.userId;

  if (!userId || !productId || !designData) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required data' });
  }

  try {
    const updated = await Design.findOneAndUpdate(
      { userId, productId },
      { designData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res
      .status(200)
      .json({ success: true, message: 'Design saved', designId: updated._id });
  } catch (err) {
    console.error('Error saving design:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const loadDesign = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user?.id || req.userId;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required data' });
  }

  try {
    const design = await Design.findOne({ userId, productId });
    if (design) {
      res.status(200).json({ success: true, designData: design.designData });
    } else {
      res.status(404).json({ success: false, message: 'Design not found' });
    }
  } catch (err) {
    console.error('Error loading design:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { saveDesign, loadDesign };
