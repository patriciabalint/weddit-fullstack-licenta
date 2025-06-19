import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth Middleware: Token missing or invalid format.');
    return res
      .status(401)
      .json({ success: false, message: 'Not Authorized, Login Again' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // extensibil, mai curat
    //console.log('Auth Middleware: Token decoded, user attached:', req.user.id);
    next();
  } catch (error) {
    console.log('Auth Middleware: Token verification failed.', error);
    res
      .status(401)
      .json({ success: false, message: 'Error during token verification.' });
  }
};

export default authUser;
