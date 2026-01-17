// Validation middleware for common inputs

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  if (username.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Username must be at least 3 characters'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  next();
};

const validatePhoto = (req, res, next) => {
  const { judul, galery_id } = req.body;

  if (!judul || !galery_id) {
    return res.status(400).json({
      success: false,
      message: 'Title and gallery ID are required'
    });
  }

  if (judul.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Title must be at least 2 characters'
    });
  }

  next();
};

const validateCategory = (req, res, next) => {
  const { judul } = req.body;

  if (!judul) {
    return res.status(400).json({
      success: false,
      message: 'Category name is required'
    });
  }

  if (judul.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Category name must be at least 2 characters'
    });
  }

  next();
};

const validateComment = (req, res, next) => {
  const { user_name, comment_text, data_galery_id } = req.body;

  if (!user_name || !comment_text || !data_galery_id) {
    return res.status(400).json({
      success: false,
      message: 'Name, comment, and photo ID are required'
    });
  }

  if (user_name.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters'
    });
  }

  if (comment_text.length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Comment must be at least 5 characters'
    });
  }

  next();
};

module.exports = {
  validateLogin,
  validatePhoto,
  validateCategory,
  validateComment
};