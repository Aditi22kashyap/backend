const mongoose = require('mongoose');

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    const uri='mongodb+srv://aditikashyapofficial11:mern1@cluster0.cbxhdlr.mongodb.net/mernassignment1?retryWrites=true&w=majority';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process with a non-zero code
  }
};

module.exports = connectToDatabase;
