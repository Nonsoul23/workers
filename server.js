const express =  require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');



const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://127.0.0.1:27017/register')
const db = mongoose.connection
db.once('open',()=>{
    console.log("Mongodb connection sucessfully")
})

const userSchema = new mongoose.Schema({
    fullname:String,
    email:String,
    password:String
});

// Create a model based on the user schema
const Users = mongoose.model("data", userSchema);

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS
app.use(cors({
    origin: 'http://127.0.0.1:3001',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for the help page
app.get('/help', (req, res) => {
    res.sendFile(path.join(__dirname, 'help.html'));
});

// Route for the about page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// API endpoint for login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = new Users({
        email: email,
        password: password
    })
    

    try {
        // Find the user by email
        const user = await Users.findOne({ email });
        if (user && await (password, user.password)) {
            res.json({ message: 'Login successful!', redirect: '/dashboard' });
        } else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
      
// API endpoint for registration (for demonstration purposes)
app.post('/api/register', async(req, res) => {
    const { fullname, email, password } = req.body;
    const user = new Users({
        fullname: fullname,
        email: email,
        password: password
    })
    await user.save()
    console.log(user)
   
    // Here you would normally save the user to your database
    res.send('Registration successful!');
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

