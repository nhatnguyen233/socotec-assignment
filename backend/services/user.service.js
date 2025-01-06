import Pool from "../sql/db.js";
import { NotFoundError } from "../utils/errors.js";

export const getUserById = async (id) => {
  const queryText = {
    text: ` SELECT * FROM users WHERE id = $1 LIMIT 1`,
    values: [id],
  };
  try {
    const { rows } = await Pool.query(queryText);

    if (rows[0]) {
      delete rows[0].password;
      return rows[0];
    }
    throw new NotFoundError("Not found User");
  } catch (error) {
    console.error("[UserService - getUserById] error :: ", error);
    throw error;
  }
};

export const updateUser = async (id, data, file) => {
  const { firstName, lastName, email, country, city, phoneNumber, position } =
    data;

  // Handling avatar upload
  let avatarUrl = null;
  if (file) {
    avatarUrl = `/uploads/${file.filename}`;
  }

  const queryText = `
    UPDATE users
    SET 
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      email = COALESCE($3, email),
      country = COALESCE($4, country),
      city = COALESCE($5, city),
      phone_number = COALESCE($6, phone_number),
      position = COALESCE($7, position),
      avatar_url = COALESCE($8, avatar_url)
    WHERE id = $9
    RETURNING id, first_name AS firstName, last_name AS lastName, email, country, city, phone_number AS phoneNumber, position, avatar_url AS avatarUrl;
  `;

  const values = [
    firstName || null,
    lastName || null,
    email || null,
    country || null,
    city || null,
    phoneNumber || null,
    position || null,
    avatarUrl || null,
    id,
  ];

  try {
    const { rows } = await Pool.query(queryText, values);
    if (rows.length === 0) {
      throw new NotFoundError("User not found");
    }
    // Successful update
    return rows[0];
  } catch (error) {
    console.error("[UserService - updateUser] error :: ", error);
    throw error;
  }
};

export const deleteUserById = async (id) => {
  const queryText = {
    text: `DELETE FROM users WHERE id = $1 RETURNING *`,
    values: [id],
  };

  try {
    const { rows } = await Pool.query(queryText);

    if (rows[0]) {
      return { message: "User deleted successfully" };
    }

    throw new NotFoundError("User not found to delete");
  } catch (error) {
    console.error("[UserService - deleteUserById] error :: ", error);
    throw error;
  }
};
