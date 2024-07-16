import express from "express";

import { authenticateTeacher } from "../middlewares/auth.js";
import TeacherController from "../controllers/teacherController.js";

const teacherController = new TeacherController();
const router = express.Router();

router.get(
    "/teacher/dashboard",
    authenticateTeacher,
    teacherController.dashboard,
);
router.get("/teacher/subjects/", authenticateTeacher, (req, res) =>
    res.redirect("/teacher/dashboard"),
);
router.get(
    "/teacher/subject/:subjectId/addGrade",
    authenticateTeacher,
    teacherController.getRegisteredStudents,
);
router.post(
    "/teacher/subject/:subjectId/addGrade",
    authenticateTeacher,
    teacherController.addGrade,
);
router.get(
    "/teacher/info",
    authenticateTeacher,
    teacherController.getTeacherInfo,
);
router.post(
    "/teacher/info",
    authenticateTeacher,
    teacherController.updateTeacherInfo,
);

export default router;
