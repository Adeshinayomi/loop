const User = require('../Models/User');
const bcrypt = require('bcryptjs');


exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, bio, profilePicture, location, password } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingemail = await User.findOne({ email });
        if (existingemail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be longer than 6 characters!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ 
            firstName,
            lastName,
            username,
            email,
            bio,
            profilePicture,
            location,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json(newUser);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

