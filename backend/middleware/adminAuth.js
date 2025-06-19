import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Not Authorized Login Again' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifici rolul din token
    if (decoded.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Access denied, admin only.' });
    }

    req.user = decoded; // Salvezi userul decodat pentru rute
    next();
  } catch (error) {
    console.error('adminAuth error:', error);
    res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
};

export default adminAuth;
