const mongoose = require('mongoose');

const User = mongoose.model('users');
const Room = mongoose.model('rooms');

module.exports = app => {
  app.post('/api/new_room', async (req, res) => {
    let { name, userId } = req.body;
    name = name.trim();

    const nameError = await validRoomName(name);
    if (nameError) {
      console.log(nameError);
      return res
        .status(400)
        .json(nameError)
        .send();
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res
        .status(400)
        .json({
          success: false,
          message: 'User not found'
        })
        .send();
    }

    try {
      const room = await new Room({
        name,
        userList: {
          userId,
          admin: true
        }
      }).save();

      user.roomsOwned.push(room.id);
      user.save();

      return res
        .json({
          success: true,
          message: 'The room was successfully created!'
        })
        .send();
    } catch (error) {
      console.log('Database error');
      return res
        .status(400)
        .json({
          success: false,
          message: 'Database error'
        })
        .send();
    }
  });
};

async function validRoomName(name) {
  const existingRoom = await Room.findOne({ name: name.trim() });
  console.log('room:', existingRoom);
  if (existingRoom) {
    return {
      success: false,
      message: 'Room already exists'
    };
  } else if (name === '') {
    return {
      success: false,
      message: 'Room name is empty'
    };
  } else if (!name.match(/^[0-9a-zA-Z ]+$/)) {
    return {
      success: false,
      message: 'Room name must be alphanumeric'
    };
  }

  return null;
}
