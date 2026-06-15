import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }
    const newMessages = new Message({
      senderId,
      receiverId,
      message,
      conversationId: chats._id
    });

    if (newMessages) {
      chats.messages.push(newMessages._id);
    }
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessages);
    }
    await Promise.all([chats.save(), newMessages.save()]);
    res.status(201).send(newMessages);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error
    });
    console.log(error);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");
    if (!chats) return res.status(200).send([]);
    const messages = chats.messages;
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error
    });
    console.log(error);
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Find the conversation
    const chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!chats) {
      return res.status(200).send({ success: true, message: "Chat already empty" });
    }

    // Delete all message documents referenced in this conversation
    if (chats.messages && chats.messages.length > 0) {
      await Message.deleteMany({ _id: { $in: chats.messages } });
    }

    // Clear the messages array in the conversation
    chats.messages = [];
    await chats.save();

    res.status(200).send({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || error
    });
    console.log(error);
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const senderId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).send({ success: false, message: "Message not found" });
    }

    if (message.senderId.toString() !== senderId.toString()) {
      return res.status(403).send({ success: false, message: "Unauthorized to delete this message" });
    }

    if (message.conversationId) {
      await Conversation.findByIdAndUpdate(message.conversationId, {
        $pull: { messages: messageId }
      });
    }

    await Message.findByIdAndDelete(messageId);

    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    }

    res.status(200).send({ success: true, message: "Message deleted successfully", messageId });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || error
    });
    console.log(error);
  }
};

export const likeMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).send({ success: false, message: "Message not found" });
    }

    const hasLiked = message.likes.includes(userId);
    if (hasLiked) {
      message.likes = message.likes.filter(id => id.toString() !== userId.toString());
    } else {
      message.likes.push(userId);
    }

    await message.save();

    const receiverSocketId = getReceiverSocketId(message.receiverId);
    const senderSocketId = getReceiverSocketId(message.senderId);

    if (receiverSocketId && message.receiverId.toString() !== userId.toString()) {
      io.to(receiverSocketId).emit("messageLiked", { messageId, likes: message.likes });
    }
    if (senderSocketId && message.senderId.toString() !== userId.toString()) {
      io.to(senderSocketId).emit("messageLiked", { messageId, likes: message.likes });
    }

    res.status(200).send({ success: true, message: "Message liked successfully", messageId, likes: message.likes });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || error
    });
    console.log(error);
  }
};
