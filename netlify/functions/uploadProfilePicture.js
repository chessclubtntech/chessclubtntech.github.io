/*const mongoose = require('mongoose');
const User = require('../../models/user.js'); // Adjust the path as necessary
const aws = require('aws-sdk'); // Assuming you're using AWS S3 for storage
const { v4: uuidv4 } = require('uuid');

const mongoUri = process.env.MONGODB_URI;
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

exports.handler = async (event) => {
  try {
    const { userId, image } = JSON.parse(event.body);
    
    if (!userId || !image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID and image are required' })
      };
    }

    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'chess_database'
      });
    }

    // Upload image to S3
    const buffer = Buffer.from(image, 'base64');
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${userId}/${uuidv4()}.jpg`,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };
    
    const uploadResult = await s3.upload(s3Params).promise();

    // Update user's profile picture URL in MongoDB
    const user = await User.findByIdAndUpdate(userId, { profilePicture: uploadResult.Location }, { new: true });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Profile picture updated successfully', profilePictureUrl: uploadResult.Location })
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
*/
