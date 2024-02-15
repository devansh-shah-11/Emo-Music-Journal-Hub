const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');

const app = express()
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json())

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const port = 8000;

const mongodb_uri ='mongodb://localhost:27017/';
const client = new MongoClient(mongodb_uri);

// load environment variables
require('dotenv').config();

client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const db = client.db('JournalApp');
const collection = db.collection('users');

// handle signup
app.post('/signup', async (req, res) => {
    user = req.body.params;
    console.log(user);
    if (!user.name){
        return res.status(400).json({ message: 'Name is required' });
    }
    if (!user.email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    
    // check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(user.email)) {
        return res.status(400).json({ message: 'Email is invalid' });
    }

    const existingUser = await collection.findOne({ email: user.email });
    if (existingUser) {
        console.log("Heyh there", existingUser)
        return res.status(400).json({ message: 'User already exists! Please login' });
    }

    if (!user.password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    // if (user.password.length < 8 || user.password.specialCharacter<1 || user.password.digit<1 || user.password.uppercase<1 || user.password.lowercase<1) {
    //     return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one special character, one digit, one uppercase letter, and one lowercase letter' });    
    // }

    if (!user.mobilenumber) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    const mobileNumberRegex = /^\d{10}$/;
    if (!mobileNumberRegex.test(user.mobilenumber)) {
        return res.status(400).json({ message: 'Mobile number is invalid' });
    }

    if (!user.age) {
        return res.status(400).json({ message: 'Age is required' });
    }

    if(!user.occupation){
        return res.status(400).json({ message: 'Occupation is required' });
    }

    console.log("Hiiiiii there", existingUser)

    encryptedUserPassword = await bcrypt.hash(user.password, 10);
    user.password = encryptedUserPassword;

    res.json({ message: 'Signup successful' });

    collection.insertOne(user).then(result => {
        console.log(result);
    }).catch(err => {
        console.error('Error inserting user', err);
    });
});

// handle login
app.post('/login', async (req, res) => {
    user = req.body.params;
    if (!user.email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!user.password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    const existingUser = await collection.findOne({ email: user.email });
    console.log(existingUser);
    if (existingUser && await (bcrypt.compare(user.password, existingUser.password))) {
        const token = jwt.sign({ email: user.email, name: existingUser.name }, process.env.TOKEN_KEY, { expiresIn: '12h' });
        console.log(token);
        collection.updateOne({ email: user.email }, { $set: { session_token: token } }).then(result => {
            console.log(result);
        }).catch(err => {
            console.error('Error setting token', err);
        });
        
        return res.json({ message: 'Login successful' , session_token: token});
    } 
    else {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
});

app.post('/logout', async (req, res) => {
    token = req.body.headers.session_token;
    if (!token) {
        return res.status(400).json({ message: 'User is not logged in' });
    }

    const existingUser = await collection.findOne({ session_token: token });
    console.log(existingUser);
    
    if (existingUser) {
        collection.updateOne({ session_token: token }, { $set: { session_token: '' } }).then(result => {
            console.log(result);
        }).catch(err => {
            console.error('Error logging out user!', err);
        });
        console.log('Logout successful');
        return res.json({ message: 'Logout successful' });
    }
});

app.post('/addentry', async (req, res) => {
    console.log(req.body)
    token = req.body.headers.session_token;
    if (!token) {
        return res.status(400).json({ message: 'User is not logged in' });
    }

    const existingUser = await collection.findOne({ session_token: token });
    console.log("welcome you: ",existingUser);
    
    if (existingUser) {
        entry = req.body.params;
        if (!entry.title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        if (existingUser.entries) {
            entries = existingUser.entries;
            console.log("Existing Entries: ", entries);
            if (entries[entry.title]) {
                return res.status(400).json({ message: 'Entry already exists' });
            }
        }
        else {
            entries = {};
        }
        entries[entry.title] = entry.body;
        console.log("Updated Entries: ", entries);
        collection.updateOne({ session_token: token }, { $set: { entries: entries } }).then(result => {
            console.log(result);
        }).catch(err => {
            console.error('Error adding entry', err);
        });
        console.log('Entry added successfully');
        return res.json({ message: 'Entry added successfully' });
    }
});

app.get('/getuser', async (req, res) => {
    console.log("yoman yoman 123")
    token = req.headers.session_token;
    console.log(req)
    if (!token) {
        console.log("User is not logged in");
        return res.status(400).json({ message: 'User is not logged in' });
    }

    const existingUser = await collection.findOne({ session_token: token });
    console.log("Found user: ",existingUser);
    return res.json(existingUser);
});


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})