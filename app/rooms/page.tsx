import AuthRedirectComponent from "@/components/common/AuthRedirectComponent";
import RoomList from "@/components/rooms/RoomList";
import LogoutButton from "@/components/common/LogoutButton";

function RoomsPage() {
  return (
    <div>
      <AuthRedirectComponent />
      <LogoutButton />

      <h1>Available Rooms</h1>
      <RoomList />
    </div>
  );
}

export default RoomsPage;
