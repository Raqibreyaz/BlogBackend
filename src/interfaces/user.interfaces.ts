import { Document } from "mongoose";

export interface userInterface extends Document {
  username: string;
  email: string;
  password: string;
  image: {
    url: string;
    public_id: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateToken(): string;
}
