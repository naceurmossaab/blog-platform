const jwt = require('jsonwebtoken');

const createJWT = ({ payload }, expiresIn) => {
  const options = {};
  if (expiresIn) options.expiresIn = expiresIn;

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + +process.env.REFRESH_TOKEN_LIFETIME),
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};