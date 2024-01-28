// Use import syntax for ECMAScript modules
import { Server } from 'socket.io';
import Ticket from '../models/ticket.model.js';

export default function initializeSocket(server) {

    // Create a Socket.io server by passing your HTTP server instance (express or http).
    const io = new Server(server);

    // Define socket.io events and handlers here
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle when a user sends a chat message
        socket.on('chatMessage', async (data) => {

           
            const { ticketId , message , userId } = JSON.parse(data) ;

            const conversation = {
                sentBy: userId,
                message,
            }

            try {
                const updatedTicket = await Ticket.findOneAndUpdate(
                    { ticketId: ticketId },
                    { $push: { conversations: conversation } },
                    { new: true } // Return the modified document rather than the original
                );

                if (!updatedTicket) {
                    console.error(`Ticket with ticketId ${ticketId} not found.`);
                    return;
                }

                // Broadcast the message to all connected clients
                io.emit('chatMessage', data);
            } catch (error) {
                console.error('Error updating conversations:', error.message);
                // Handle the error as needed
            }
        });

        // Handle when a user disconnects
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
}
