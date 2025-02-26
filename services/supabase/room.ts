import { supabase } from "@/lib/supabaseClient";
import { Room, RoomRow } from "@/types/room";
import { User } from "@/types/user";

export const fetchRooms = async (userId: string): Promise<Room[]> => {
  try {
    const { data: roomUsersData, error: roomUsersError } = await supabase
      .from("room_users")
      .select("room_id")
      .eq("user_id", userId);

    if (roomUsersError) {
      console.error("Error fetching room users:", roomUsersError.message);
      return [];
    }

    const roomIds = roomUsersData.map((ru) => ru.room_id);
    if (roomIds.length === 0) return [];

    const { data: roomsData, error: roomsError } = await supabase
      .from("rooms")
      .select("id, name, created_at, creator_id")
      .in("id", roomIds)
      .order("created_at", { ascending: false });

    if (roomsError) {
      console.error("Error fetching rooms:", roomsError.message);
      return [];
    }

    const creatorIds = roomsData.map((room) => room.creator_id);

    const { data: creatorsData, error: creatorsError } = await supabase
      .from("users")
      .select("id, username, avatar_url, email")
      .in("id", creatorIds);

    if (creatorsError) {
      console.error("Error fetching creators:", creatorsError.message);
      return [];
    }

    const creatorsMap = new Map<string, User>(
      creatorsData.map((creator) => [creator.id, creator])
    );

    const { data: roomUsersFullData, error: roomUsersFullError } =
      await supabase
        .from("room_users")
        .select("room_id, user_id")
        .in("room_id", roomIds);

    if (roomUsersFullError) {
      console.error(
        "Error fetching room users full data:",
        roomUsersFullError.message
      );
      return [];
    }

    const userIds = roomUsersFullData.map((ru) => ru.user_id);

    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, username, avatar_url, email")
      .in("id", userIds);

    if (usersError) {
      console.error("Error fetching users:", usersError.message);
      return [];
    }

    const usersMap = new Map<string, User>(
      usersData.map((user) => [user.id, user])
    );

    return roomsData.map((room: RoomRow) => ({
      id: room.id,
      name: room.name,
      createdAt: new Date(room.created_at),
      creator: creatorsMap.get(room.creator_id) || undefined,
      participants: roomUsersFullData
        .filter((ru) => ru.room_id === room.id)
        .map((ru) => {
          const user = usersMap.get(ru.user_id);
          return user || undefined;
        })
        .filter((user): user is User => user !== undefined),
    }));
  } catch (error) {
    console.error("Unexpected error in fetchRooms:", error);
    return [];
  }
};
