const path=require('path')
const http = require('http')
const express=require('express')
const socketio =require('socket.io')
const formatMessage=require('./utils/messages.js')
const {userJoin, getCurrentUser,userLeave,getRoomUsers} =require('./utils/users')
const PORT= 3000||process.env.PORT
const app =express()
const server = http.createServer(app)
const io= socketio(server)
app.use(express.static(path.join(__dirname,'public')))
const botName='chatCord Bot'
io.on('connection',socket =>{
    //console.log('new WS Connection')

    //Run when client connects
    socket.on('joinRoom',({username,room})=>{
    const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        //Welcome to current user
    socket.emit('message',formatMessage(botName,'WelCome to chatApp'))

    //Broadcast when user connects
    socket.broadcast
    .to(user.room)
    .emit(
        'message',
        formatMessage(botName,`${user.username}  has joined the chat`))

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUsers(user.room)
        })
    })

    //Send users room and  info

   


    //Listen chat message
    socket.on('chatMessage', msg =>{
        const user =getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })
      //listen wn client disconnects
      socket.on('disconnect', ()=> {
          const user = userLeave(socket.id)

          if(user){

            io.to(user.room).emit(
                'message'
                , formatMessage(botName,`${user.username} has left the chat`))

                io.to(user.room).emit('roomUsers',{
                    room: user.room,
                    users:getRoomUsers(user.room)
                })
          }

          
        })
    
        
    })


server.listen(PORT,()=>{
    console.log(`server running on port number ${PORT}`)
})








 


















