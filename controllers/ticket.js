import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const createTicket = async (req, res) => {
    try {
        const { status, subject, priority,attachments ,conversations}=req.body
        const createdBy=req.params.userId
        console.log(createdBy,status,subject, priority, attachments,conversations)
        const ticket=new Ticket({
            createdBy, 
            subject,
            priority,
            attachments,
            conversations
        })
        ticket.save()
        res.status(200).json({ data: ticket})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getTicket = async (req, res) => {
    try {
        const userId= req.params.userId
        const user=await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });
        var ticketPromises=[];
        console.log(typeof(user.role))
        if(user.role=="user"){
            console.log("i'm ins")
            ticketPromises = user.tickets.map(async (ticketId) => {
            const ticket = await Ticket.findOne({ _id: new mongoose.Types.ObjectId(ticketId) }).populate([{
                path: 'conversations',
                populate: {
                  path: 'sentBy',
                  model: 'User', // Assuming 'User' is the name of your User model
                  select: 'username', // You can specify the fields you want to select from the User model
                },
              },
              {
                path: 'createdBy',
                model: 'User',
                select: 'username',
              }]
              );
            return ticket; // Assuming Ticket.findOne returns the ticket document
        })}
        if(user.role=="support"){
            ticketPromises=(await Ticket.find().populate([{
                path: 'conversations',
                populate: {
                  path: 'sentBy',
                  model: 'User',
                  select: 'username',
                },
              },
              {
                path: 'createdBy',
                model: 'User',
                select: 'username',
              }])).map(async (ticket)=>{
                return ticket;
            })
            console.log("alltickets",ticketPromises)
        }

        // Wait for all ticketPromises to resolve
       const tickets = await Promise.all(ticketPromises);
       res.status(200).json({ data: tickets });
               

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



export {
    createTicket,
    getTicket,
    
}