import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  console.log("TOKEN RECEIVED 👉", token); // 🔥 DEBUG

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("DECODED 👉", decoded); // 🔥 DEBUG

    req.user = decoded;
    next();

  } catch (err) {
    console.log("JWT ERROR 👉", err.message); // 🔥 DEBUG
    return res.status(401).json({ message: "Invalid token" });
  }
};