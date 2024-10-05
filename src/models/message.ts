import { Model, RelationMappings, RelationMappingsThunk } from "objection";
import UserModel from "./user";

class MessageModel extends Model {
  static tableName: string = "messages";
  static relationMappings: RelationMappings | RelationMappingsThunk = {
    users: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,

      join: {
        from: "messages.user_id",
        to: "users.id",
      },
    },
  };
}

export default MessageModel;