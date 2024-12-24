import { Room } from "./room";
import { User } from "./user";

export interface Message {
  id: string;
  room: Room;
  sender: User;
  content: string;
  createdAt: Date;
  expiresAt?: Date;
}
