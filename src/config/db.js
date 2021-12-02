const mongoose = require('mongoose');

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  });
  console.log(
    `MongoDb Database Successfully Connected with HOST: ${conn.connection.host}`
  );
};

module.exports = connectDb;
