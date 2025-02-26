const requestLogger = (req, res, next) => {
    const start = Date.now();
  
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: `${duration}ms`,
        ip: req.ip,
      };
  
      console.log(
        `[${logData.timestamp}] ${logData.method} ${logData.url} - ${logData.status} (${logData.responseTime}) - IP: ${logData.ip}`
      );
    });
  
    next();
  };
  
  module.exports = requestLogger;