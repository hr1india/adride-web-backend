import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  console.log("Received Headers: ", req.headers);
  console.log("Received Cookies: ", req.cookies);
  const token = req.cookies?.adminToken || req.headers.authorization?.split(" ")[1];
  console.log("Admin token : ", token);

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authenticated as Admin" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};
