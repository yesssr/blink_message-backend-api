import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4, v4 } from "uuid";
import { success } from "../utils/utils";
import userServices from "../services/users.services";
import { SendError } from "../middleware/error";
import chatSessionService from "../services/chat_session.services";
import messageServices from "../services/message.services";

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

  getChatSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.app.locals.credentials.id;
      const getListIdSession = await chatSessionService.getListSessionId(
        user_id
      );
      const getSessions = await chatSessionService.getChatSession(
        getListIdSession,
        user_id
      );
      success(res, "suck", 200, getSessions);
    } catch (error) {
      next(error);
    }
  },

  createMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chat_session_id } = req.body;
      const senderId = req.app.locals.credentials.id;
      const dataSession = {
        user_id: senderId,
        last_message: req.body.text,
        name: req.body.name,
        type: req.body.type,
      };
      if (!chat_session_id) {
        const createSession = await chatSessionService.createSession(
          dataSession
        );
        await chatSessionService.createUserSession(
          createSession.id,
          senderId,
          req.body.user_id
        );
        req.body.chat_session_id = createSession.id;
      } else {
        await chatSessionService.updateLastMessage({
          id: chat_session_id,
          ...dataSession,
        });
      }
      req.body.user_id = senderId;
      req.body.id = v4();
      const saveMessage = await messageServices.saveMessage(req.body);
      success(res, "message send!", 201, saveMessage);
    } catch (error) {
      next(error);
    }
  },

  getMessageBySession: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { session_id } = req.params;
      const messages = await messageServices.getMessage(session_id);
      success(res, "get message by session", 200, messages)
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
