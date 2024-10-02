import { Router } from "express";
import { authRouter } from "./auth";
import { errorHandler } from "../../middleware/error";

const router = Router();

router.use("/auth", authRouter);
router.use(errorHandler);

export default router;