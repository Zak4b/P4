import express from "express";
import { auth } from "../midleware.js";

import { loginRouter } from "./login.js";
import { apiRouter } from "./api.js";
export const router = express();

// Public login routes (no auth required)
router.use("/login", loginRouter);

// Protected API routes
router.use(auth());
router.use("/api", apiRouter);
