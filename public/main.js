const socket = io()

const clientsTotal = document.getElementById('clients-total')
const msg = document.getElementById('msg-container')
const nameInput = document.getElementById('name-input')
const msgForm = document.getElementById('msg-form')
const msgInput = document.getElementById('msg-input')
const msgTone = new Audio('/Best notification sound.mp3')
//add an event on our msg form
msgForm.addEventListener('submit',(e)=>{
    e.preventDefault() 
    sendMessage()
})


socket.on('client-total',(data)=>{
    clientsTotal.innerText = `Total clients: ${data}`
})

function sendMessage(){
    if(msgInput.value === '') return 
    // console.log(msgInput.value)
    const data ={
        name: nameInput.value,
        msg: msgInput.value,
        dateTime: new Date()
    }
    socket.emit('msg',data)
    addMsgToUI(true,data)
    msgInput.value = ''

}

socket.on('chat-msg',(data)=>{
    // console.log(data)
    msgTone.play();
    addMsgToUI(false,data)
})

function addMsgToUI(isOwnMsg,data){
    clrfeedback();
    const ele = `
            <li class="${isOwnMsg ? "msg-right": 'msg-left'}">
                <p class="msg">
                    ${data.msg}
                    <span>${data.name} ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>`
    msg.innerHTML += ele  
    scrollToBottom()      
}

function scrollToBottom(){
    msg.scrollTo(0,msg.scrollHeight)
}

msgInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback: `${nameInput.value} is typing a message`
    })
})

msgInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback: `${nameInput.value} is typing a message`
    })
})

msgInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback: ''
    })
})

socket.on('feedback',(data)=>{
    clrfeedback();
    const element =  `
    <li class="msg-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>
            `
    msg.innerHTML  += element
})

function clrfeedback() {
    document.querySelectorAll('li.msg-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}

