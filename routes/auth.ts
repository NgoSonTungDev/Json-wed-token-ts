import express from "express";
import authController from "../controllers/authController";
import { verifyAdminToken, verifyTokenAuth } from "../middleware/auth";

const router = express.Router();

router.post("/create", authController.createUser);

router.get("/all", verifyTokenAuth, authController.getAll);

router.get("/an", verifyTokenAuth, authController.getMe);

router.post("/login", authController.login);

router.post("/refresh", authController.refreshToken);

router.get(
  "/decentralization",
  verifyAdminToken,
  authController.decentralization
);

router.delete("/delete/:id", authController.delete);

export default router;
