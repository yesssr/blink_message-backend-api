import MessageModel from "../models/message"

const messageServices = {
  saveMessage: (data: object) => {
    return MessageModel.query()
      .insert(data);
  },
  getMessage: (session_id: string) => {
    return MessageModel.query()
      .select(
        "messages.id",
        "user_id",
        "users.name as user",
        "chat_session_id",
        "text",
        "is_read",
        "messages.created_at as message_time",
      )
      .joinRelated("users")
      .where("is_deleted", false)
      .andWhere("chat_session_id", session_id)
      .orderBy("message_time", "DESC");
  }
}

export default messageServices;