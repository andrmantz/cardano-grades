import express from "express";

import { authenticateAny } from "../middlewares/auth.js";
import InfoController from "../controllers/infoController.js";

const infoController = new InfoController();
const router = express.Router();

router.get("/", authenticateAny, (req, res) =>
    res.redirect(`/${req.userRole}/dashboard`),
);

router.get("/subjects/:id", infoController.getSubject);

router.get("/policies", infoController.getPolicies);

router.get("/studentaddress/:id", infoController.studentAddress);

router.get("/utxos/:address", infoController.utxosAt);

export default router;
