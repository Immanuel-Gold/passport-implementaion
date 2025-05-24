export const verifyUser = (req, res, next) => {
  if (req.isUnauthenticated()) {
    return res.status(409).json({ err: "UnAuthorized!" });
  }

  next();
};
