import express from "express";
import { login, signUp } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/sign-up", signUp);
