const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const roomSchema = new Schema({
  name: String,
  userList: [
    {
      userId: ObjectId,
      admin: Boolean
    }
  ],
  messages: [
    {
      text: String,
      fromId: ObjectId,
      timestamp: Date
    }
  ]
});

mongoose.model('rooms', roomSchema);
