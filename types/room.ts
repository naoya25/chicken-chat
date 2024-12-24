import { User } from "./user";

export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  creator?: User;
  participants?: User[];
}
