import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import designRouter from './routes/designRoute.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://weddit-frontend.vercel.app',
      'https://weddit-admin.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // doar dacă folosești cookies sau login cu sesiuni
  })
);

// API routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/design', designRouter);

// Root route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server started on PORT: ${port} - http://localhost:${port}`);
  });
}

export default app;
