import UserModel from "../models/user";

const userServices = {
  createUser: (data: object) => {
    return UserModel.query()
      .insert(data)
      .returning("*");
  },
  updateVerify: (id:string) => {
    return UserModel.query()
      .where("id", id)
      .patch({
        is_verified: true,
        email_verified_at: new Date().toISOString(),
      });
  },
  deleteUser: (id: string) => {
    return UserModel.query()
      .where("email", id)
      .del();
  },
  checkEmail: (email: string) => {
    return UserModel.query()
      .select(
        "id",
        "email",
        "password",
        "is_verified",
      )
      .where("email", email)
      .first();
  }
};

export default userServices;