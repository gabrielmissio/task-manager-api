const jwt = require('jsonwebtoken');
const { SECRET } = require('../confing/env');
const { HttpResponse } = require('../../presentation/helpers');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const unauthorized = () => {
    const response = HttpResponse.unauthorized();
    return res.status(response.statusCode).json(response.body);
  };

  if (!authorizationHeader) return unauthorized();

  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2) return unauthorized();

  const [schema, token] = parts;
  if (schema !== 'Bearer') return unauthorized();

  jwt.verify(token, SECRET, (err) => {
    if (err) return unauthorized();

    return next();
  });
};
