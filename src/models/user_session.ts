import {
  JSONSchema,
  Model,
  RelationMappings,
  RelationMappingsThunk,
} from "objection";
import UserModel from "./user";
import ChatSessionModel from "./chat_session";

export default class UserSession extends Model {
  static tableName: string = "user_sessions";
  static jsonSchema: JSONSchema = {
    type: "object",
    required: ["user_id", "chat_session_id"],
    properties: {
      id: { type: "string" },
      user_id: { type: "string" },
      chat_session_id: { type: "string" },
    },
  };

  static relationMappings: RelationMappings | RelationMappingsThunk = {
    users: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,

      join: {
        from: "user_session.user_id",
        to: "users.id",
      },
    },

    chat_sessions: {
      relation: Model.BelongsToOneRelation,
      modelClass: ChatSessionModel,

      join: {
        from: "user_session.chat_session_id",
        to: "caht_sessions.id",
      },
    },
  };
}
