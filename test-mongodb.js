const { MongoClient } = require('mongodb');

async function testMongoDBConnection() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, {
        // Deprecated options removed
    });

    try {
        await client.connect();
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

testMongoDBConnection();
