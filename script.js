// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBblpZdFi8E3Lcf-4yEoJ3yhUonWmgpgyc",
  authDomain: "nexchat-8c980.firebaseapp.com",
  projectId: "nexchat-8c980",
  storageBucket: "nexchat-8c980.appspot.com",
  messagingSenderId: "87765028514",
  appId: "1:87765028514:web:26a575692fa3e343e491fb",
  measurementId: "G-C9X3P5K8F5",
  databaseURL: "https://nexchat-8c980-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to send message
window.sendMessage = function () {
  const username = document.getElementById("username").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  if (username === "" || message === "") {
    alert("Please enter your name and message.");
    return;
  }

  const timestamp = new Date().toLocaleTimeString();

  const msg = {
    username: username,
    message: message,
    timestamp: timestamp
  };

  push(ref(database, "messages"), msg);

  document.getElementById("messageInput").value = "";
};

// Display new messages
const messagesRef = ref(database, "messages");
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  displayMessage(data.username, data.message, data.timestamp);
});

function displayMessage(username, message, timestamp) {
  const messagesDiv = document.getElementById("messages");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");

  msgDiv.innerHTML = `
    <span class="username">${username}</span>: 
    <span class="text">${message}</span>
    <span class="timestamp">${timestamp}</span>
  `;

  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
