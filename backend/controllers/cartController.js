import userModel from '../models/userModel.js';

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    let cartData = userData.cartData || {};
    cartData[itemId] = true;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCart = async (req, res) => {
  res
    .status(501)
    .json({ success: false, message: 'Not implemented in digital mode' });
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    let cartData = userData.cartData || {};
    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
``;
