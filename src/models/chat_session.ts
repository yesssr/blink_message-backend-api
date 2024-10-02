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

class ChatSessionModel extends Model {
  id!: string;
  is_deleted!: boolean;
  
  static tableName: string = "chat_sessions";
  static jsonSchema: JSONSchema = {
    type: "object",
    required: ["own_id", "user_id"],
    properties: {
      id: { type: "string" },
      own_id: { type: "string" },
      user_id: { type: "string" },
    },
  };
  static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,

      join: {
        from: "chat_session.user_id",
        to: "users.id",
      },
    },
    
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,

      join: {
        from: "chat_session.own_id",
        to: "users.id",
      },
    },
    
    messages: {
      relation: Model.HasManyRelation,
      modelClass: MessageModel,

      join: {
        from: "chat_session.own_id",
        to: "users.id",
      },
    }, 
  });

  static modifiers: Modifiers<AnyQueryBuilder> = {
    get_message(query) {
      query
      .withGraphFetched("messages")
      .modifyGraph("message", (builder) => {
        builder
          .select(
            "id",
            "chat_session_id",
            "text",
            "created_at",
            "updated_at",
          )
          .where("is_deleted", false)
          .orderBy("created_at", "DESC")
          .first();
      })
    }
  };
}

export default ChatSessionModel;