import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase, ref, push, onChildAdded, set, onValue, remove, onDisconnect
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBblpZdFi8E3Lcf-4yEoJ3yhUonWmgpgyc",
  authDomain: "nexchat-8c980.firebaseapp.com",
  projectId: "nexchat-8c980",
  storageBucket: "nexchat-8c980.appspot.com",
  messagingSenderId: "87765028514",
  appId: "1:87765028514:web:26a575692fa3e343e491fb",
  databaseURL: "https://nexchat-8c980-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let currentUser = null;

function updateOnlineStatus(uid, isOnline) {
  const userStatusRef = ref(db, "status/" + uid);
  const userInfo = {
    email: currentUser.email,
    state: isOnline ? "online" : "offline",
    lastChanged: Date.now()
  };

  set(userStatusRef, userInfo);
  if (isOnline) {
    onDisconnect(userStatusRef).set({
      email: currentUser.email,
      state: "offline",
      lastChanged: Date.now()
    });
  }
}

function trackOnlineUsers() {
  const statusRef = ref(db, "status");
  onValue(statusRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list = Object.entries(data).map(([uid, info]) => {
      const isSelf = uid === currentUser.uid;
      const label = isSelf ? " (You)" : "";
      const status = info.state === "online" ? "🟢 Online" : `🔴 Offline (last seen ${timeAgo(info.lastChanged)})`;
      return `${info.email}${label} - ${status}`;
    });
    document.getElementById("online-users").innerText = list.join("\n");
  });
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

window.login = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .catch(e => alert("Login Failed: " + e.message));
};

window.signup = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .catch(e => alert("Signup Failed: " + e.message));
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    updateOnlineStatus(user.uid, true);
    trackOnlineUsers();
    loadMessages();
  } else {
    document.getElementById("auth-container").style.display = "block";
    document.getElementById("chat-container").style.display = "none";
  }
});

window.logout = () => {
  if (currentUser) updateOnlineStatus(currentUser.uid, false);
  signOut(auth);
};

window.sendMessage = () => {
  const msg = document.getElementById("messageInput").value.trim();
  if (!msg) return;
  const message = {
    uid: currentUser.uid,
    username: currentUser.email,
    message: msg,
    timestamp: new Date().toLocaleTimeString()
  };
  push(ref(db, "messages"), message);
  document.getElementById("messageInput").value = "";
};

function loadMessages() {
  const messagesRef = ref(db, "messages");
  onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    displayMessage(data.username, data.message, data.timestamp);
  });
}

function displayMessage(username, message, timestamp) {
  const div = document.getElementById("messages");
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerHTML = `
    <span class="username">${username}</span>:
    <span class="text">${message}</span>
    <span class="timestamp">${timestamp}</span>
  `;
  div.appendChild(msg);
  div.scrollTop = div.scrollHeight;
}
