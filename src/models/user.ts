import { JSONSchema, Model, RelationMappings, RelationMappingsThunk } from "objection";

class UserModel extends Model {
  id!: string;
  email!: string;
  password?: string;
  is_verified!: boolean;
  email_verified_at?: string;

  static tableName: string = "users";

  static jsonSchema: JSONSchema = {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      email: { type: "string" },
      email_verified_at: { type: "string" },
      password: { type: "string", minLength: 8 },
      remember_token: { type: "string" },
    },
  };

  static relationMappings: RelationMappings | RelationMappingsThunk = () => ({
    sessions: {
      relation: Model.ManyToManyRelation,
      modelClass: UserModel,
      join: {
        from: "users.id",
        through: {
          from: "user_sessions.user_id",
          to: "user_sessions.chat_session_id",
        },
        to: "chat_sessions.id",
      },
    },
  });
}

export default UserModel;
