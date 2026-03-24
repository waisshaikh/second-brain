import jwt from "jsonwebtoken";

// Generate Access Token (Short-lived)
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

//  Generate Refresh Token (Long-lived)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};