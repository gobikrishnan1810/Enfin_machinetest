// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors= require('cors');
const BookRoute= require('./routes/BookRoute');

const app = express();
app.use(express.json(
    express.urlencoded
));
app.use(cors());
app.get('/',(req,res)=>{
    res.json('welcome')
})
mongoose.connect('mongodb://localhost:27017/Enfin', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/books', BookRoute);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
