import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  success,
  sendEmailVerification,
  verifyToken,
  hashPass,
  comparePass,
  createToken,
} from "../utils/utils";
import userServices from "../services/users.services";
import { SendError } from "../middleware/error";

const auth = {
  authCredentials: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new SendError(401, "invalid credentials!");
      const decoded = verifyToken(token);
      req.app.locals.credentials = decoded;
      next();
    } catch (error) {
      next(error);
    }
  },
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const { email } = data;
      const isEmailRegistered = await userServices.checkEmail(email);
      if (isEmailRegistered) throw new SendError(400, "Email is registerd!.");

      data.id = uuidv4();
      data.password = await hashPass(req.body.password);
      const user = await userServices.createUser(data);
      const verifyEmail = await sendEmailVerification(user.email!);

      success(res, "Verification email sent!.", 201, verifyEmail.response);
    } catch (error) {
      next(error);
    }
  },

  verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      if (!token) throw new SendError(400, "missing token");

      const payload = verifyToken(token);
      if (!payload) throw new SendError(400, "invalid token!");

      if (typeof payload != "string") {
        const user = await userServices.checkEmail(payload.email);
        if (!user) throw new SendError(400, "invalid or expire token.");

        await userServices.updateVerify(user.id);
        success(res, "Email Verification successfully!", 200);
      }
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email) throw new SendError(400, "email is required");
      if (!password) throw new SendError(400, "password is required");

      const user = await userServices.checkEmail(email);
      if (!user) throw new SendError(401, "email is not registered!");

      if (!user.is_verified)
        throw new SendError(
          401,
          "email is not verified, please check your email"
        );
        
      const isMatch = await comparePass(password, user.password!);
      if (!isMatch) throw new SendError(401, "wrong password");

      delete user.password;
      const credentials = createToken(user, "90d");
      success(res, "login successfully", 200, ...[,], ...[,], credentials);
    } catch (error) {
      next(error);
    }
  },
};

export default auth;
