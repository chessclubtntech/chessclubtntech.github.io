const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../models/user'); // Adjust path as necessary

exports.handler = async function(event, context) {
    if (event.httpMethod === 'POST') {
        const { username, email, password } = JSON.parse(event.body);

        try {
            // Connect to MongoDB
            await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'User already exists' }),
                };
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();

            return {
                statusCode: 201,
                body: JSON.stringify({ message: 'User registered successfully' }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Registration failed', error: error.message }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }
};
