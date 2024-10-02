import { Request, Response, NextFunction } from "express";
import {v4 as uuidv4} from "uuid";
import { success, sendEmailVerification, verifyToken, hashPass } from "../utils/utils";
import userServices from "../services/users.services";
import { SendError } from "../middleware/error";

const userController = {
  delUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;
      const user = await userServices.deleteUser(email);
      success(res, "delete succes", 200, user);
    } catch (error) {
      next(error);
    }
  },

};

export default userController;