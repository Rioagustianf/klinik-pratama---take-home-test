import { Router } from "express";
import {
  listPatients,
  detailPatient,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import { verifyJWT, checkRole } from "../middlewares/auth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/patients",
  verifyJWT,
  checkRole(["Admin", "Petugas", "Dokter"]),
  asyncHandler(listPatients),
);
router.get(
  "/patients/:id",
  verifyJWT,
  checkRole(["Admin", "Petugas", "Dokter"]),
  asyncHandler(detailPatient),
);

router.post(
  "/patients",
  verifyJWT,
  checkRole(["Admin", "Petugas"]),
  asyncHandler(createPatient),
);
router.put(
  "/patients/:id",
  verifyJWT,
  checkRole(["Admin", "Petugas"]),
  asyncHandler(updatePatient),
);
router.delete(
  "/patients/:id",
  verifyJWT,
  checkRole(["Admin", "Petugas"]),
  asyncHandler(deletePatient),
);

export default router;
