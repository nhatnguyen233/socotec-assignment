import express from 'express';
import {
  deleteUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/user.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import UploadMiddleware from '../middlewares/upload.middleware.js';

export const userRouter = express.Router();

userRouter.get('/:id/profile', AuthMiddleware, getUserProfile);
userRouter.delete('/:id/profile', AuthMiddleware, deleteUser);
userRouter.patch(
  '/:id/profile',
  AuthMiddleware,
  UploadMiddleware.single('avatar'),
  updateUserProfile
);
