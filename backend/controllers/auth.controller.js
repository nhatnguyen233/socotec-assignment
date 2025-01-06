import { successResponse } from '../response/index.js';
import { loginUser, registerUser } from '../services/auth.service.js';

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const data = await loginUser(email, password);
    successResponse(res, data, 200);
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const data = await registerUser(email, password);
    successResponse(res, data, 201);
  } catch (error) {
    next(error);
  }
};
