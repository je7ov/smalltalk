const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const User = mongoose.model('users');
const Room = mongoose.model('rooms');

module.exports = app => {
  app.post('/api/new_room', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, keys.jwtSecret);
    const userId = decoded.sub;

    let { name } = req.body;
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
        nameLower: name.toLowerCase(),
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

  app.post('/api/delete_room', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, keys.jwtSecret);
    const userId = decoded.sub;

    let { name } = req.body;
    name = name.trim();

    const room = await Room.findOne({ nameLower: name.toLowerCase() });

    const userData = room.userList.find(user => (user.userid = userId));
    if (!userData) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' })
        .send();
    }

    if (!userData.admin) {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized to delete' })
        .send();
    }

    Room.remove({ _id: room.id }, async err => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: 'Error removing room' })
          .send();
      }

      const user = await User.findById(userData.userId);
      if (user) {
        updatedRooms = user.roomsOwned.filter(
          roomOwned => !roomOwned.equals(room.id)
        );
        user.roomsOwned = user.roomsOwned.filter(
          roomOwned => !roomOwned.equals(room._id)
        );
        user.save();
      }

      res.json({ success: true, message: 'Room successfully deleted' });
    });
  });
};

async function validRoomName(name) {
  const existingRoom = await Room.findOne({
    nameLower: name.trim().toLowerCase()
  });

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
  } else if (!name.match(/^[0-9a-zA-Z '.?!-]+$/)) {
    return {
      success: false,
      message: 'Room name must be alphanumeric'
    };
  }

  return null;
}
