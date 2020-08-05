const socket = io();

const messageArea = document.querySelector(".message_area");
const inputMsg = document.querySelector("#inputMsg");
const sendBtn = document.querySelector("#sendBtn");
var msgTone = new Audio("/chat_alert.mp3");

let name;

do {
  name = prompt("Please Enter Your Name For Join Chat");
} while (!name);

let append = (name) => {
  let mainDiv = document.createElement("div");
  mainDiv.classList.add("joined");
  let userName = `<h4>${name} Joined Chat</h4>`;
  mainDiv.innerHTML = userName;
  messageArea.appendChild(mainDiv);
};

let leftUser = (name) => {
  let mainDiv = document.createElement("div");
  mainDiv.classList.add("left");
  let userName = `<h4>${name} Left The Chat</h4>`;
  mainDiv.innerHTML = userName;
  messageArea.appendChild(mainDiv);
};

socket.emit("newUser", name);

socket.on("userJoined", (name) => {
  append(name);
  recentMsg();
  msgTone.play();
});

sendBtn.addEventListener("click", () => {
  sendMessage(inputMsg.value);
});

function sendMessage(message) {
  let msg = {
    users: name,
    message: message,
  };

  appendMessage(msg, "outgoing");
  // console.log(msg);
  socket.emit("send", message);
  inputMsg.value = "";

  recentMsg();
}

function appendMessage(msg, type) {
  // console.log(msg);
  let msgDiv = document.createElement("div");
  let className = type;
  msgDiv.classList.add(className, "message");

  let markup = `
        <h4> ${msg.users} </h4>
        <p> ${msg.message} </p>
    `;
  msgDiv.innerHTML = markup;
  messageArea.appendChild(msgDiv);
}

//Recieved Message

socket.on("recieve", (msg) => {
  appendMessage(msg, "incoming");
  msgTone.play();
  recentMsg();
});

function recentMsg() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

socket.on("leftuser", (name) => {
  leftUser(name);
  recentMsg();
  msgTone.play();
});
