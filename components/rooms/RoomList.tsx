"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Room } from "@/types/room";
import { supabase } from "@/lib/supabaseClient";

function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchRooms() {
      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select('*');

      if (error) {
        console.error('Error fetching rooms:', error.message);
        return;
      }

      setRooms(roomsData || []);
    }
    fetchRooms();
  }, []);

  const handleRoomClick = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
  };

  return (
    <ul>
      {rooms.map((room) => (
        <li key={room.id} onClick={() => handleRoomClick(room.id)}>
          {room.name}
        </li>
      ))}
    </ul>
  );
}

export default RoomList;
