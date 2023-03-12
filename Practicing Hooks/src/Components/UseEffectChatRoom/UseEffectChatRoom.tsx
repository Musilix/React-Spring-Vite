import { useEffect, useState } from "react";
import { createChatRoomConnection } from "../../Services/ChatRoom";
import "./UseEffectChatRoom.css";

export default function UseEffectChatroom(props: any) {
  const [serverUrl, setServerUrl] = useState("http://localhost:8080");

  // use our chatroom svc to connect to the pseudo chatroom on mount + whenever the roomId or serverUrl (for some reason) changes
  useEffect(() => {
    // setup logic
    const chatRoomConn = createChatRoomConnection(serverUrl, props.roomId);
    try {
      chatRoomConn.connect();
    } catch (e) {
      console.error(
        `There was an issue connecting to the ${props.roomId} room`
      );
    }

    // cleanup logic
    return () => chatRoomConn.disconnect();
  }, [props.roomId, serverUrl]);

  return (
    <>
      <section id="chatroom-wrap">
        <h2>
          Welcome to the{" "}
          <span
            style={{
              backgroundColor: "mediumpurple",
              color: "#1a1a1a",
              padding: "2px",
              borderRadius: "5px",
            }}
          >
            {props.roomId}
          </span>{" "}
          room! You cannot speak though, sorry.
        </h2>
        <label>
          Server URL:
          <input
            type="text"
            name="serverUrl"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
          />
        </label>
      </section>
    </>
  );
}
