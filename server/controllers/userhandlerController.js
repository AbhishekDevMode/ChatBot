import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserID = req.user._id;
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } }
          ]
        },
        {
          _id: { $ne: currentUserID }
        }
      ]
    })
      .select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error
    });
    console.log(error);
  }
};

export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserID = req.user._id;
    const currentChatters = await Conversation.find({
      participants: currentUserID
    }).sort({ updatedAt: -1 });
    if (!currentChatters || currentChatters.length === 0)
      return res.status(200).send([]);
    const participantsIDs = currentChatters.reduce((ids, conversation) => {
      const otherParticipants = conversation.participants.filter(
        (id) => id.toString() !== currentUserID.toString()
      );
      return [...ids,...otherParticipants];
    }, []);
    const otherParticipantsIDs=participantsIDs.filter(id=>id.toString() !== currentUserID.toString());
    const user=await User.find({_id:{$in:otherParticipantsIDs}}).select("-password").select("-email");
    const users=otherParticipantsIDs.map(id=>user.find(u=>u._id.toString()==id.toString()));
    
    res.status(200).send(users);

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error
    });
    console.log(error);
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const currentUserID = req.user._id;
    if (!req.file) {
      return res.status(400).send({ success: false, message: "No image file provided" });
    }
    
    // Construct URL for the uploaded file
    const profilePicUrl = `/uploads/${req.file.filename}`;
    
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      currentUserID,
      { profilepic: profilePicUrl },
      { returnDocument: 'after' }
    ).select("-password");
    
    res.status(200).send({
      success: true,
      message: "Profile picture updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || error
    });
    console.log(error);
  }
};
