import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // If no token or invalid format (Bearer token), respond with Unauthorized
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized: No token provided");
  }

  // Extract token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "jwt_secret");

    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Respond with Unauthorized if token is invalid or expired
    throw new UnauthorizedError("Unauthorized: No token provided");
  }
};

export default authMiddleware;
