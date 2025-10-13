import mongoose from 'mongoose';

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shafferography';

let connection: mongoose.Connection;

const connectDB = async () => {
  console.log('mongo uri is:');
  console.log(process.env.MONGO_URI);
  if (!connection) {
    const conn = mongoose.createConnection(process.env.MONGO_URI!);
    await new Promise<void>((resolve, reject) => {
      conn.once("open", () => resolve());
      conn.once("error", reject);
    });

    await conn.db.admin().command({ ping: 1 });

    console.log('MongoDB Connected');

    mongoose.Promise = global.Promise;

    connection = conn;
  }

  return connection;
};

export { connectDB, connection };
