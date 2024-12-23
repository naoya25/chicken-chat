import AuthRedirectComponent from "@/components/common/AuthRedirectComponent";
import RoomList from "@/components/rooms/RoomList";
import LogoutButton from "@/components/common/LogoutButton";
import UserInfo from "@/components/common/UserInfo";

function RoomsPage() {
  return (
    <div>
      <AuthRedirectComponent />
      <LogoutButton />
      <UserInfo />

      <h1>Available Rooms</h1>
      <RoomList />
    </div>
  );
}

export default RoomsPage;
