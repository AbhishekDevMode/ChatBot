import { create } from "zustand";
 const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessage: (messagesOrUpdater) => set((state) => {
    const currentMessages = Array.isArray(state.messages) ? state.messages : [];
    const nextMessages = typeof messagesOrUpdater === 'function' 
      ? messagesOrUpdater(currentMessages) 
      : messagesOrUpdater;
    return { messages: Array.isArray(nextMessages) ? nextMessages : [] };
  }),
}));

export default useConversation;