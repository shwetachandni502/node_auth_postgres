import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const headerData = req.header("Authorization");
  const bearer = headerData.split(" ")[1];

  if (!bearer) {
    return res.status(401).json({ status: false, msg: "Authorization denied" });
  }
  try {
    const decoded = jwt.verify(bearer, process.env.JWT_SECRET_KEY);
    req.tokenUser = decoded.tokenUser;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send({ status: false, msg: "token expired" });
    }
    res.status(401).json({ status: false, msg: "Authorizaton denied" });
  }
}
