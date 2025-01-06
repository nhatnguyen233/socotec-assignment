import express from "express";
import path, { join } from "path";
import morganMiddleware from "./middlewares/logger.middleware.js";
import { authRouter } from "./routers/auth.router.js";
import { config } from "dotenv";
import { userRouter } from "./routers/user.router.js";
import errorHandler from "./middlewares/error.middleware.js";

config({ path: join(process.cwd(), ".env") });

const port = process.env.PORT || 3002;

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(morganMiddleware);

// Serve the uploads folder statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (req, res) => res.send({ message: "ok" }));
app.use("/auth", authRouter);
app.use("/user", userRouter);

// Error handler (must be the last middleware)
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Datatys App running on port ${port}.`);
});
export default server;
