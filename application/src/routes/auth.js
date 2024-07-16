import express from "express";

import AuthController from "../controllers/authController.js";

const authController = new AuthController();
const router = express.Router();

router.get("/login", (req, res) => res.render("login"));
router.post("/login", authController.login);
router.get("/logout", authController.logout);

export default router;
