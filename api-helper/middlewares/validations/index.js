import Ajv from 'ajv';

export default function validateBody(schema) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const valid = validate(req.body);
    if (valid) {
      return next();
    } else {
      const error = validate.errors[0];
      if (error && error.instancePath) {
        return res.status(400).json({
          error: {
            message: `"${error.instancePath.substring(1)}" ${error.message}`,
          },
        });
      } else {
        return res.status(400).json({
          error: {
            message: error.message, // Fallback to displaying just the error message
          },
        });
      }
    }
  };
}
