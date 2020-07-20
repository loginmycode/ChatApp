const chatForm = document.getElementById('chat-form')
const chatMessages =document.querySelector('.chat-messages')
const roomName =document.getElementById('room-name')
const userList =document.getElementById('users')



const {username, room}= Qs.parse(location.search,{
    ignoreQueryPrefix:true
})


const socket =io()

//Join chatroom
socket.emit('joinRoom',{username, room})

//Get Room And users

socket.on('roomUsers',({room, users}) =>{
    outputRoomName(room)
    outputUsers(users)


})

//message from server side
socket.on('message',message=>{
    console.log(message)
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
})
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //get message text
    const msg=e.target.msg.value;
    //Emit message server side
    socket.emit('chatMessage',msg)

    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

})

function outputMessage(message){
    const div =document.createElement('div')
    div.classList.add('message')
    div.innerHTML=`<p class="meta"> ${message.username} <span> ${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}



//Add room names to dom
function outputRoomName(room){
    roomName.innerText=room

}
//Add users to dom
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}