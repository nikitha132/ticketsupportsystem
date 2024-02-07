import mongoose from 'mongoose';
import User from '../models/user.model.js'; // Make sure to provide the correct path to your userModel file
import Ticket from '../models/ticket.model.js';
const signup = async (req, res) => {
    try {
        console.log(req.body)
        const { username, email, password, role } = req.body;

        // Check if the user with the given email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            password, // You might want to hash the password before saving it in a real-world scenario
            role,
        });

        // Save the user to the database
        await newUser.save();

        res.status(200).json({ message: 'User registered successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        // Implement your login logic here
        // You might want to check the provided credentials against the stored user data
        // and generate a token if the credentials are valid
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        // If no user found, return an error
        if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
        }
  
        // Compare the provided password with the stored password in the database
        if (password !== user.password) {
         return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If everything is correct, send the user's _id in the response
        res.json({ userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const assignTicket=async(req,res)=>{
    try{
    const {ticketId,userId}= req.body;
    console.log(ticketId,userId)
    const ticket = await Ticket.findOne({ _id: new mongoose.Types.ObjectId(ticketId) });
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
    user.tickets.push(ticket) 
    user.save()
    res.status(200).json({message:"ticket assigned successfully"})
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
}

}
export { signup, login,assignTicket };
