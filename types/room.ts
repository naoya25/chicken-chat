import { Database } from "./database";
import { User } from "./user";

export type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];
export type RoomInsert = Database["public"]["Tables"]["rooms"]["Insert"];
export type RoomUpdate = Database["public"]["Tables"]["rooms"]["Update"];

export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  creator?: User;
  participants?: User[];
}


export interface SupabaseRoom {
  id: string;
  name: string;
  creator_id: string;
  created_at: string;
}
