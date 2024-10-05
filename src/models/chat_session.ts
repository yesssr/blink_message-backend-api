import {
  AnyQueryBuilder,
  JSONSchema,
  Model,
  Modifiers,
  RelationMappings,
  RelationMappingsThunk,
} from "objection";
import UserModel from "./user";
import MessageModel from "./message";
import UserSession from "./user_session";

class ChatSessionModel extends Model {
  id!: string;
  type!: string;
  is_deleted!: boolean;

  static tableName: string = "chat_sessions";
  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      type: { enum: ["individuals", "group"] },
      last_message: { type: "string" },
      user_id: { type: "string" },
    },
  };
  static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
    other_users: {
      relation: Model.ManyToManyRelation,
      modelClass: UserModel,
      join: {
        from: "chat_sessions.id",
        through: {
          from: "user_sessions.chat_session_id",
          to: "user_sessions.user_id",
        },
        to: "users.id",
      },
    },
    
    users: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,

      join: {
        from: "chat_sessions.user_id",
        to: "users.id",
      },
    },

    messages: {
      relation: Model.HasManyRelation,
      modelClass: MessageModel,

      join: {
        from: "chat_sessions.id",
        to: "messages.chat_session_id",
      },
    },

    user_sessions: {
      relation: Model.HasManyRelation,
      modelClass: UserSession,

      join: {
        from: "chat_sessions.id",
        to: "user_sessions.chat_session_id",
      },
    },
  });

  static modifiers: Modifiers<AnyQueryBuilder> = {
    get_message(query) {
      query
        .withGraphFetched("messages as last_message")
        .modifyGraph("last_message", (builder) => {
          builder
            .select(
              "messages.id",
              "chat_session_id",
              "user_id",
              "users.name as sender",
              "text",
              "messages.created_at",
              "messages.updated_at"
            )
            .joinRelated("users")
            .where("messages.is_deleted", false)
            .orderBy("messages.created_at", "DESC")
            .groupBy("users.name");
        });
    },
  };
}

export default ChatSessionModel;
