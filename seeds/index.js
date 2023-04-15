const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const cities = require('./cities');

const { places, descriptors } = require('./seedHelpers');
const Camp = require('../models/camp');
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: 'ugWYgEPWN6jJQSoNPaS-zUu-euDU5LUHnfrgZ4PfEYg',
        collections: 1114848,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
}

const seedDB = async () => {
  await Camp.deleteMany({});
  for (let i = 0; i < 30; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Camp({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)}, ${sample(places)}`,
      image: await seedImg(),
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, veritatis autem. Sint ipsam iste animi suscipit maxime delectus fugit incidunt illo ea explicabo odit eveniet nesciunt, dolore ipsa accusantium et.',
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
