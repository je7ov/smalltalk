const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const roomSchema = new Schema({
  name: String,
  messages: [
    {
      text: String,
      fromId: ObjectId,
      timestamp: Date
    }
  ]
});

mongoose.model('rooms', roomSchema);
