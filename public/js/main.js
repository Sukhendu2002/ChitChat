const socket = io();
//get message from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//join room
socket.emit("joinRoom", { username, room });
console.log(username, room);

// get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  document.querySelector(".chat-messages").scrollTop =
    document.querySelector(".chat-messages").scrollHeight;
});

const chatForm = document.querySelector("#chat-form");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.msg.value;
  //   console.log(message);
  socket.emit("chatMessage", message);
  e.target.elements.msg.value = "";
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  //   div.innerHTML = `<p class="meta">sukhendu <span>10.11</span></p>
  //   <p class="text">
  //     ${message}
  //   </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
  const roomName = document.getElementById("room-name");
  roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
  const usersList = document.getElementById("users");
  usersList.innerHTML = `
    ${users
      .map((user) => `<li><a href="private.html">${user.username}</a></li>`)
      .join("")}
  `;
}

//private chat
