import { Server } from "socket.io";
import { verifyToken } from "../utils/utils";
import chatSessionService from "../services/chat_session.services";
import messageServices from "../services/message.services";
import { v4 } from "uuid";

export const chatSocket = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = verifyToken(token);
      socket.data.user = decoded;
    } catch (err) {
      return next(new Error("invalid credentials!."));
    }
    next();
  });

  io.on("connection", async (socket) => {
    const id = socket.data.user.id;
    // const listSession = await chatSessionService.getAllSession(id);
    // io.emit(`/chat-session/${id}`, listSession);

    socket.on("send-message", async (data) => {
      try {
        const sessData = {
          own_id: id,
          user_id: data.user_id,
        };
        if (!data.chat_session_id) {
          // const createSession = await chatSessionService.createSession(
          //   sessData.own_id,
          //   sessData.user_id
          // );
          // data.chat_session_id = createSession.id;
        }
        delete data.own_id;
        data.id = v4();
        await messageServices.saveMessage(data);
        const getMessage = await messageServices.getMessage(
          data.chat_session_id
        );

        // const listSession = await chatSessionService.getAllSession(
        //   data.user_id
        // );
        // io.emit(`/chat-session/${data.user_id}`, listSession);
        // io.emit(`/chat/${data.session_id}`, getMessage);
      } catch (error) {
        console.log(error);
      }
    });
  });

  io.on("disconnect", (socket) => {
    console.log("user disconnected");
  });
};
