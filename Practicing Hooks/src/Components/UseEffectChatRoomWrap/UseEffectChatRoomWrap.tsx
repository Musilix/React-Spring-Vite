import { useState } from "react";
import UseEffectChatroom from "../UseEffectChatRoom/UseEffectChatRoom";
import "./UseEffectChatRoomWrap.css";

export default function UseEffectChatRoomWrap() {
  const [roomId, setRoomId] = useState("general");
  const [showRoom, setShowRoom] = useState(false);

  return (
    <>
      <section>
        <div className="chatroom-block">
          <p>
            Welcome to the chat hub. Go ahead and choose the room you'd like to
            join
          </p>

          {!showRoom && (
            <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              <option value="General">General</option>
              <option value="Cryptids">Cryptids</option>
              <option value="Yeast Lovers">Yeast Lovers</option>
            </select>
          )}

          <button onClick={() => setShowRoom(!showRoom)}>
            {showRoom ? "Leave Room" : "Join Room"}
          </button>
        </div>

        <div className="chatroom-block">
          {showRoom && <UseEffectChatroom roomId={roomId} />}
        </div>
      </section>
    </>
  );
}
