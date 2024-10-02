import { v4 } from "uuid";
import ChatSessionModel from "../models/chat_session";

const chatSessionService = {
  getAllSession: (id: string) => {
    return ChatSessionModel.query()
      .select(
        "id",
        "own_id",
        "user_id",
        "created_at",
        "updated_at"
      )
      .joinRelated("messages")
      .modify("get_message")
      .where("own_id", id);
  },
  createSession: (own_id: string, user_id: string) => {
    const create =  {
      id: v4(),
      own_id,
      user_id,
    };
    return ChatSessionModel.query()
      .insert(create)
      .returning("*");
  },
  deleteSession: (id: string) => {
    return ChatSessionModel.query()
      .patch({is_deleted: true})
      .where("id", id);
  }
}

export default chatSessionService;