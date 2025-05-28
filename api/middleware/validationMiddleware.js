const validator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const friendlyErrors = error.details.map((detail) => {
        const field = detail.path.join('.');
        const message = detail.message.replace(/["']/g, '');
        return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`;
      });

      return res.status(400).json({
        message: 'Invalid request data',
        errors: friendlyErrors
      });
    }

    next();
  };
};

module.exports = validator;
