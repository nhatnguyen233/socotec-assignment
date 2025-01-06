import shajs from "sha.js";
import Pool from "../sql/db.js";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../utils/errors.js";

const JWT_SECRET = process.env?.JWT_SECRET || "jwt_secret";
const JWT_EXPIRATION = "1h"; // Token expiration
const SECRET = process.env.SECRET || "test-dev-secret";
/**
 * Generate hash password
 * Generate online: https://emn178.github.io/online-tools/sha256.html
 * @param {string} email
 * @param {string} password
 */
export const hashPassword = (email, password) =>
  shajs("sha256").update(`${email}${password}${SECRET}`).digest("hex");

export const loginUser = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const hash = hashPassword(email, password);
  const queryText = {
    text: ` SELECT s.id, s.email, s.first_name as firstName, s.last_name as lastName
              FROM users s
              WHERE email = $1 AND password = $2`,
    values: [email, hash],
  };
  try {
    const { rows } = await Pool.query(queryText);
    if (rows[0]) {
      const userInfo = rows[0];
      const accessToken = jwt.sign(
        userInfo, // Payload
        JWT_SECRET, // Secret key
        { expiresIn: JWT_EXPIRATION } // Options
      );
      return {
        accessToken,
        userInfo,
      };
    }
    throw new BadRequestError("Bad credentials");
  } catch (error) {
    console.error("[AuthService - loginUser] error :: ", error);
    throw error;
  }
};

export const registerUser = async (email, password) => {
  const hash = hashPassword(email, password);
  const queryText = {
    text: `INSERT INTO users (email, password)
           VALUES ($1, $2)
           RETURNING id, email`,
    values: [email, hash],
  };
  try {
    const { rows } = await Pool.query(queryText);
    if (rows[0]) {
      const userInfo = rows[0];
      const accessToken = jwt.sign(userInfo, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
      return {
        accessToken,
        userInfo,
      };
    }
  } catch (error) {
    console.error("[AuthService - registerUser] error :: ", error);
    throw error;
  }
};
