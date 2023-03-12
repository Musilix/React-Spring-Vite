export function createChatRoomConnection(serverUrl: string, roomId: number) {
  return {
    connect() {
      // add connection logic here
      console.log(`Connecting to room #${roomId} at ${serverUrl}`);
    },
    disconnect() {
      // add disconnect logic here
      console.log(`Disconnecting from room #${roomId} at ${serverUrl}`);
    },
  };
}
