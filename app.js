const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const app = express();

dotenv.config();
const Camp = require('./models/camp');
const methodOverride = require('method-override');

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;
mongoose.set({ strictQuery: true });

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongoDB connected'))
  .catch((err) => console.log(err));

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home');
});

app.get(
  '/neercamp',
  catchAsync(async (req, res, next) => {
    const camps = await Camp.find({});
    res.render('camp/index', { camps });
  })
);

app.get('/neercamp/new', async (req, res) => {
  res.render('camp/new');
});

app.post(
  '/neercamp',
  catchAsync(async (req, res, next) => {
    const camp = new Camp(req.body.camp);
    await camp.save();
    res.redirect(`/neercamp/${camp._id}`);
  })
);

app.get('/neercamp/:id', async (req, res) => {
  const { id } = req.params;
  const camp = await Camp.findById(id);
  res.render('camp/show', { camp });
});

app.get('/neercamp/:id/edit', async (req, res) => {
  const { id } = req.params;
  const camp = await Camp.findById(id);
  res.render('camp/edit', { camp });
});

app.put('/neercamp/:id', async (req, res) => {
  const { id } = req.params;
  const camp = await Camp.findByIdAndUpdate(
    id,
    { ...req.body.camp },
    { new: true }
  );
  res.redirect(`/neercamp/${camp.id}`);
});

app.delete('/neercamp/:id', async (req, res) => {
  const { id } = req.params;
  const camp = await Camp.findByIdAndRemove(id);
  res.redirect('/neercamp');
});

app.use((err, req, res, next) => {
  res.send('something went wrong');
});

app.listen(PORT, () => {
  console.log(`serving at http://localhost:${PORT}`);
});
