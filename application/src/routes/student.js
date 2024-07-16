import express from "express";

import { authenticateStudent } from "../middlewares/auth.js";
import StudentController from "../controllers/studentController.js";

const studentController = new StudentController();
const router = express.Router();

router.get(
    "/student/dashboard",
    authenticateStudent,
    studentController.dashboard,
);
router.get(
    "/student/subjects",
    authenticateStudent,
    studentController.getAvailableSubjects,
);
router.post(
    "/student/subjects",
    authenticateStudent,
    studentController.registerSemester,
);
router.get(
    "/student/info",
    authenticateStudent,
    studentController.getStudentInfo,
);
router.post(
    "/student/info",
    authenticateStudent,
    studentController.updateStudentInfo,
);
router.post("/student/mint", authenticateStudent, studentController.mintDegree);

export default router;
