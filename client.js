import { createEle, updateDom } from "./myModules.js";
let id = 0;
const socket = io("/", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});
socket.on("connection", (data) => console.log(data));
socket.on("detected", (data) => updateDom(data,id++));
socket.on("success", (data) => updateDom(data,id++));
socket.on("error", (data) => updateDom(data,id++));

// console.log("HE")
const text = document.getElementById("text");
const body = document.getElementById("body");
const info = document.getElementById("info");

//buttons
const btnread = document.getElementById("btnread");
const btnwrite = document.getElementById("btnwrite");

btnread.addEventListener("click", (e) => socket.emit("read"));

btnwrite.addEventListener("click", (e) => {
  info.insertAdjacentHTML(
    "afterbegin",
    "<h1 class='text-center'>enter text to be written and scan the tag</h1>"
  );

  socket.emit("write", { text: text.value });

  console.log("sent from client");
});
