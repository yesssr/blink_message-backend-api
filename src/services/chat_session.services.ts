import { v4 } from "uuid";
import ChatSessionModel from "../models/chat_session";

const chatSessionService = {
  getListSessionId: async (user_id: string) => {
    return await ChatSessionModel.query()
      .joinRelated("users")
      .where("users.id", user_id)
      .select("chat_sessions.id")
      .then((row) => row.map((data) => data.id));
  },
  // getUserSession: (session_id: string[], user_id: string) => {
  //   const latestMessagesSubquery = ChatSessionModel.query()
  //     .select("messages.chat_session_id")
  //     .max("messages.created_at as latest_created_at")
  //     .joinRelated("messages")
  //     .groupBy("messages.chat_session_id")
  //     .as("latestMessages");

  //   const results = ChatSessionModel.query()
  //     .select(
  //         "chat_sessions.id",
  //         "chat_sessions.type",
  //         "chat_sessions.name as chat_name",
  //         "users.name",
  //         "users.id as user_id",
  //         "messages.text as last_message",
  //         "messages.created_at",
  //         "messages.updated_at"
  //     )
  //     .joinRelated("users")
  //     .joinRelated("messages")
  //     .join(latestMessagesSubquery, function() {
  //         this.on("messages.chat_session_id", "=", "latestMessages.chat_session_id")
  //             .andOn("messages.created_at", "=", "latestMessages.latest_created_at");
  //     })
  //     .whereIn("chat_sessions.id", session_id)
  //     .andWhereNot("users.id", user_id)
  //     .orderBy("messages.created_at", "DESC");

  //   return results;
  // },
  getChatSession: (listSessionId: string[], userId: string) => {
    return ChatSessionModel.query()
      .select(
        "chat_sessions.id",
        "chat_sessions.type",
        "chat_sessions.name as chat_name",
        "last_message",
        "chat_sessions.user_id as sender_id",
        "users.name as sended_by",
        "other_users.name as other_user",
        "other_users.id as other_user_id",
        "chat_sessions.updated_at as last_message_time"
      )
      .joinRelated("[users, other_users]")
      .whereIn("chat_sessions.id", listSessionId)
      .andWhereNot("other_users.id", userId)
      .orderBy("chat_sessions.updated_at", "DESC")
  },
  createSession: (options: {
    last_message: string,
    user_id: string,
    type?: string, 
    name?: string, 
  }) => {
    const data = { 
      id: v4(), 
      type: options?.type, 
      name: options?.name, 
      last_message: options.last_message,
      user_id: options.user_id,
    };
    return ChatSessionModel.query()
      .insert(data)
      .returning("*");
  },
  updateLastMessage: (options: {
    id: string,
    last_message: string,
    user_id: string,
    type?: string, 
    name?: string, 
  }) => {
    const data = { 
      type: options?.type, 
      name: options?.name, 
      last_message: options.last_message,
      user_id: options.user_id,
      updated_at: new Date().toISOString(),
    };
    return ChatSessionModel.query()
      .patch(data)
      .where("id", options.id)
      .returning("*");
  },
  createUserSession: (chat_session_id: string,...user_id: string[]) => {
    const create = user_id.map(user_id => {
      return {
        id: v4(),
        chat_session_id,
        user_id: user_id,
      }
    });
    return ChatSessionModel.relatedQuery("user_sessions")
      .for(chat_session_id)
      .insert(create)
      .returning("*");
  },
  deleteSession: (id: string) => {
    return ChatSessionModel.query()
      .patch({ is_deleted: true })
      .where("id", id);
  },
};

export default chatSessionService;
