import { errorResponse, successResponse } from '../response/index.js';
import {
  deleteUserById,
  getUserById,
  updateUser,
} from '../services/user.service.js';

export const getUserProfile = async (req, res, next) => {
  const { id } = req.params;
  const { user: currentUser } = req;

  if (Number(currentUser.id) !== Number(id)) {
    return errorResponse(res, 'Forbidden', 403);
  }

  try {
    const userInfo = await getUserById(id);
    successResponse(res, userInfo, 200);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { id } = req.params;
  const { user: currentUser } = req;

  if (Number(currentUser.id) !== Number(id)) {
    return errorResponse(res, 'Forbidden', 403);
  }

  try {
    const userInfo = await updateUser(id, req.body, req?.file);
    successResponse(res, userInfo, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const { user: currentUser } = req;

  if (Number(currentUser.id) !== Number(id)) {
    return errorResponse(res, 'Forbidden', 403);
  }

  try {
    const userInfo = await deleteUserById(id);
    successResponse(res, userInfo, 200);
  } catch (error) {
    next(error);
  }
};
