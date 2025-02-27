import { Database } from "./database";
import { Room } from "./room";
import { User } from "./user";

export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"];

export interface Message
  extends Omit<
    MessageRow,
    "created_at" | "expires_at" | "room_id" | "sender_id"
  > {
  room: Room;
  sender: User;
  content: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface SupabaseMessage {
  id: string;
  content: string;
  room_id: string;
  user_id: string;
  created_at: string;
}
