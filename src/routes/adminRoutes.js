import express from "express";
import {
  registerAdmin,
  loginAdmin,
  checkAuth,
  logoutAdmin
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/check-auth", isAdmin, checkAuth); 
router.get("/logout", logoutAdmin);
router.get("/dashboard", isAdmin, (req, res) => {
  res.json({ success: true, message: "Welcome to Admin Dashboard!" });
});

export default router;
