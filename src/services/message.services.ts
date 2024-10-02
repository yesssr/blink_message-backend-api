import MessageModel from "../models/message"

const messageServices = {
  saveMessage: (data: object) => {
    return MessageModel.query()
      .insert(data);
  },
  getMessage: (session_id: string) => {
    return MessageModel.query()
      .select(
        "id",
        "user_id",
        "chat_session_id",
        "text",
        "is_read",
        "created_at",
        "updated_at",
      )
      .where("chat_session_id", session_id);
  }
}

export default messageServices;