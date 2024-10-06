import { Router } from "express";
import auth from "../../middleware/auth";
import userController from "../../controllers/users";

const router = Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/verify/:token", auth.verifyEmail);
router.use(auth.authCredentials);
router.get("/chat-session", userController.getChatSession);
router.post("/messages", userController.createMessage);
router.get("/chat-session/:session_id/messages", userController.getMessageBySession);

export { router as authRouter };
