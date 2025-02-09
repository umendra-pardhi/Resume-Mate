const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

const { GoogleGenerativeAI }=require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);




const app = express();
const PORT = 3000;


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

const resumeRoutes = require('./routes/resumeRoutes');

app.use('/resume', resumeRoutes(genAI));


app.get('/', (req, res) => {
  res.render('index', { error: null });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
