import userModel from '../models/userModel.js';

// Adaugă un produs în coș (fără cantitate)
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    cartData[itemId] = true; // ✅ doar îl marchezi ca fiind în coș

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update cart — opțional poți să îl păstrezi, dar nu e necesar
const updateCart = async (req, res) => {
  try {
    // Funcția asta devine inutilă, dar o poți păstra goală sau cu un mesaj
    res.json({ success: false, message: 'Not implemented in digital mode' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Returnează coșul actual al utilizatorului
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
