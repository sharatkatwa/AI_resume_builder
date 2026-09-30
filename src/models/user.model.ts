import { IUser } from "@/types/user.types";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
// import Document from "next/document";

interface IUserDocument extends Document,IUser {
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUserDocument>({
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    trim: true,

    required: [true, "email is required"],
  },
  password: {
    type: String,
    trim: true,
    minlength: [6, "minimum 6 charecters required"],
    required: [true, "password is required"],
  },
  phone: {
    type: Number,
  },
});

UserSchema.pre("save", function (): void {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password);
});

UserSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
