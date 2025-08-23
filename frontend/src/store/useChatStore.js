import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
      console.log("✅ Users loaded:", res.data.length);
    } catch (error) {
      console.error("❌ Error loading users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return;
    
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      console.log("✅ Messages loaded for user:", userId, "Count:", res.data.length);
    } catch (error) {
      console.error("❌ Error loading messages:", error);
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser?._id) {
      toast.error("No user selected for chat");
      return;
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      const newMessage = res.data;
      
      set({ messages: [...messages, newMessage] });
      console.log("✅ Message sent:", newMessage._id);
      
      // Scroll to bottom after sending
      setTimeout(() => {
        const messageEnd = document.querySelector('[data-message-end]');
        if (messageEnd) {
          messageEnd.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) {
      console.log("⚠️ No user selected, skipping message subscription");
      return;
    }

    const socket = useAuthStore.getState().socket;
    if (!socket?.connected) {
      console.log("⚠️ Socket not connected, skipping message subscription");
      return;
    }

    console.log("📡 Subscribing to messages for user:", selectedUser._id);

    socket.on("newMessage", (newMessage) => {
      console.log("📨 New message received:", newMessage);
      
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) {
        console.log("⚠️ Message not from selected user, ignoring");
        return;
      }

      set({
        messages: [...get().messages, newMessage],
      });

      // Scroll to bottom for new messages
      setTimeout(() => {
        const messageEnd = document.querySelector('[data-message-end]');
        if (messageEnd) {
          messageEnd.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket?.connected) {
      socket.off("newMessage");
      console.log("📡 Unsubscribed from messages");
    }
  },

  setSelectedUser: (selectedUser) => {
    console.log("👤 Selected user changed to:", selectedUser?.fullName || "None");
    set({ selectedUser });
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));