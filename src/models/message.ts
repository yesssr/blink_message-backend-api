import { Model } from "objection";

class MessageModel extends Model {
  static tableName: string = "messages";
}

export default MessageModel;