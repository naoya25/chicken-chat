import AuthRedirectComponent from "@/components/common/AuthRedirectComponent";
import LogoutButton from "@/components/common/LogoutButton";
import UserInfo from "@/components/common/UserInfo";
import RoomList from "@/components/rooms/roomList";
import CreateRoom from "@/components/rooms/createRoom";

function RoomsPage() {
  return (
    <div>
      <AuthRedirectComponent />
      <LogoutButton />
      <UserInfo />
      <CreateRoom />

      <h1>Available Rooms</h1>
      <RoomList />
    </div>
  );
}

export default RoomsPage;
