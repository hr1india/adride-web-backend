export const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
};

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};
