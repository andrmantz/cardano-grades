import express from "express";

import { authenticateAdmin } from "../middlewares/auth.js";
import AdminController from "../controllers/adminController.js";

const adminController = new AdminController();
const router = express.Router();

router.get("/admin/dashboard", authenticateAdmin, adminController.dashboard);
router.get("/admin/subjects", authenticateAdmin, (req, res) =>
    res.redirect("/admin/dashboard"),
);
router.get("/admin/info", authenticateAdmin, (req, res) =>
    res.redirect("/admin/dashboard"),
);
router.post(
    "/admin/startRegistration",
    authenticateAdmin,
    adminController.startRegistartion,
);
router.post(
    "/admin/changeSubjects",
    authenticateAdmin,
    adminController.changeDegreeSubjects,
);

export default router;
