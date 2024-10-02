import { Router } from "express";
import auth from "../../middleware/auth";

const router = Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/verify/:token", auth.verifyEmail);

export { router as authRouter };
