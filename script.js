import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase, ref, push, onChildAdded, set, onValue, remove, onDisconnect, get
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
let selectedUser = null;

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

function loadUsers() {
  const usersRef = ref(db, "users");
  onValue(usersRef, (snapshot) => {
    const users = snapshot.val() || {};
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";

    Object.entries(users).forEach(([uid, user]) => {
      if (uid === currentUser.uid) return; // don't show yourself in the list

      const li = document.createElement("li");
      li.textContent = user.email;

      const statusDot = document.createElement("span");
      statusDot.classList.add("status-dot");
      // Check status
      const statusRef = ref(db, "status/" + uid);
      onValue(statusRef, (snap) => {
        const data = snap.val();
        if (data && data.state === "online") {
          statusDot.classList.add("status-online");
          statusDot.classList.remove("status-offline");
        } else {
          statusDot.classList.add("status-offline");
          statusDot.classList.remove("status-online");
        }
      });
      li.appendChild(statusDot);

      li.onclick = () => {
        selectUser(uid, user.email, li);
      };

      userList.appendChild(li);
    });
  });
}

function selectUser(uid, email, listItemElement) {
  selectedUser = { uid, email };
  // Update UI highlight
  const lis = document.querySelectorAll("#user-list li");
  lis.forEach(li => li.classList.remove("selected"));
  listItemElement.classList.add("selected");

  // Update chat header
  const chatHeader = document.getElementById("chat-header");
  chatHeader.textContent = `Chat with ${email}`;

  // Enable input and button
  document.getElementById("messageInput").disabled = false;
  document.getElementById("sendBtn").disabled = false;

  // Load messages
  loadMessages();
}

function getChatId(uid1, uid2) {
  // Sort IDs so chat is same for both users
  return uid1 < uid2 ? uid1 + "_" + uid2 : uid2 + "_" + uid1;
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const msg = input.value.trim();
  if (!msg || !selectedUser) return;

  const chatId = getChatId(currentUser.uid, selectedUser.uid);
  const message = {
    from: currentUser.uid,
    to: selectedUser.uid,
    message: msg,
    timestamp: Date.now()
  };

  push(ref(db, "private_messages/" + chatId), message);
  input.value = "";
}

let messagesListener = null;
function loadMessages() {
  if (!selectedUser) return;

  if (messagesListener) {
    // Remove old listener before adding a new one
    messagesListener();
  }

  const chatId = getChatId(currentUser.uid, selectedUser.uid);
  const messagesRef = ref(db, "private_messages/" + chatId);
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

  messagesListener = onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    displayMessage(data);
  });
}

function displayMessage(data) {
  const messagesDiv = document.getElementById("messages");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.classList.add(data.from === currentUser.uid ? "you" : "other");
  msgDiv.textContent = data.message;

  const timeSpan = document.createElement("span");
  timeSpan.classList.add("timestamp");
  timeSpan.textContent = new Date(data.timestamp).toLocaleTimeString();

  msgDiv.appendChild(timeSpan);
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
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
    .then(cred => {
      // Add user to 'users' in DB
      const userRef = ref(db, "users/" + cred.user.uid);
      set(userRef, { email: cred.user.email });
    })
    .catch(e => alert("Signup Failed: " + e.message));
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("chat-container").style.display = "flex";
    updateOnlineStatus(user.uid, true);
    loadUsers();
  } else {
    currentUser = null;
    selectedUser = null;
    document.getElementById("auth-container").style.display = "block";
    document.getElementById("chat-container").style.display = "none";
    updateOnlineStatus(currentUser?.uid, false);
  }
});

window.logout = () => {
  if (currentUser) updateOnlineStatus(currentUser.uid, false);
  signOut(auth);
};
