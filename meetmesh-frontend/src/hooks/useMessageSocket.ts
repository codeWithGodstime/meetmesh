import useWebSocket from "react-use-websocket";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { WEB_SOCKET_URL } from "@/services/auth";

export const useMessageSocket = ({ onMessageReceived }) => {
  const queryClient = useQueryClient();
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId"); // make sure this is available

  const { lastMessage, readyState } = useWebSocket(
    `${WEB_SOCKET_URL}/`,
    {
      queryParams: { token: accessToken },
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);

        // Invalidate conversation list
        queryClient.invalidateQueries(["conversations"]);

        if (onMessageReceived) {
          onMessageReceived(data);
        }

      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    }
  }, [lastMessage]);

  return { readyState };
};
