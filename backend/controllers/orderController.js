import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import Design from '../models/designModel.js';

const currency = 'ron';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Creare comandă + Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user.id; // Obținut din middleware-ul de auth
    const { origin } = req.headers;

    if (!userId || !items || !amount) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing order data' });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error('placeOrderStripe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verificare Stripe + actualizare comandă + reset coș
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (!orderId || !success) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing verification data' });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    if (success === 'true') {
      order.payment = true;
      await order.save();

      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

      return res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false });
    }
  } catch (error) {
    console.error('verifyStripe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: toate comenzile
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: comenzile proprii
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId });

    for (const order of orders) {
      for (const item of order.items) {
        const design = await Design.findOne({
          userId,
          productId: item._id,
        });
        item.hasBeenEdited = design?.hasBeenEdited || false;
      }
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Eroare la încărcarea comenzilor:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: update status comandă
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { placeOrderStripe, verifyStripe, allOrders, userOrders, updateStatus };
