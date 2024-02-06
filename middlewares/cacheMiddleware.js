const memoryCache = require('memory-cache');
const Post = require('../models/blogs');

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl || req.url;
  const cachedData = memoryCache.get(key);
  if (cachedData) {
    return res.status(200).json({
      message: 'Data fetched from cache',
      data: cachedData
    });
  }
  next();
};

module.exports = cacheMiddleware;
