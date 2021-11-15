exports.getUsers = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Users routes so created!',
  });
};
