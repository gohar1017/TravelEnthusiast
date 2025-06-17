const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const testUsers = require('../config/testUsers');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-network', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create users with hashed passwords
    for (const user of testUsers) {
      try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        // Create new user with hashed password
        const newUser = await User.create({
          username: user.username,
          email: user.email,
          password: hashedPassword
        });

        console.log(`Created user: ${user.email}`);

        // Verify the user was created
        const savedUser = await User.findOne({ email: user.email });
        if (!savedUser) {
          throw new Error(`Failed to create user: ${user.email}`);
        }

        // Test password verification
        const isMatch = await bcrypt.compare(user.password, savedUser.password);
        if (!isMatch) {
          throw new Error(`Password verification failed for: ${user.email}`);
        }
        console.log(`Password verification successful for: ${user.email}`);
      } catch (error) {
        console.error(`Error creating user ${user.email}:`, error);
        throw error;
      }
    }

    // List all created users
    const allUsers = await User.find({});
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log('-------------------');
    });

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Run the seed function
seedUsers(); 