import { createEle, updateDom } from './myModules.js'
const socket = io('/', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
})

socket.on("connection", (data) => console.log(data))
socket.on("detected", (data) => updateDom(data))
socket.on("success", (data) => updateDom(data))
socket.on("error", (data) => updateDom(data))
// console.log("HE")


const text = document.getElementById("text");
const body = document.getElementById("body");


//buttons
const btnread = document.getElementById("btnread");
const btnwrite = document.getElementById("btnwrite");

btnread.addEventListener("click", (e) => socket.emit('read'))

btnwrite.addEventListener("click", (e) => {
  console.log(7);
  createEle("h1", body, h1 => {
    h1.textContent = "enter text to be written and scan the tag"
  })
  socket.emit('write', { text: text.value })

  console.log('sent from client');
})