/*

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase, ref, push, onChildAdded, set, onValue, onDisconnect, get, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyBblpZdFi8E3Lcf-4yEoJ3yhUonWmgpgyc",
  authDomain: "nexchat-8c980.firebaseapp.com",
  projectId: "nexchat-8c980",
  storageBucket: "nexchat-8c980.appspot.com",
  messagingSenderId: "87765028514",
  appId: "1:87765028514:web:26a575692fa3e343e491fb",
  databaseURL: "https://nexchat-8c980-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let currentUser = null;
let usersCache = {};

// Update user online status in DB
function updateOnlineStatus(uid, isOnline) {
  const statusRef = ref(db, `status/${uid}`);
  const statusData = {
    email: currentUser.email,
    state: isOnline ? "online" : "offline",
    lastChanged: serverTimestamp()
  };
  set(statusRef, statusData);

  if (isOnline) {
    // On disconnect set user offline automatically
    onDisconnect(statusRef).set({
      email: currentUser.email,
      state: "offline",
      lastChanged: serverTimestamp()
    });
  }
}

// Show online users with status and last seen
function trackOnlineUsers() {
  const statusRef = ref(db, "status");
  onValue(statusRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list = Object.entries(data).map(([uid, info]) => {
      const isSelf = uid === currentUser.uid;
      const label = isSelf ? " (You)" : "";
      const status = info.state === "online" 
        ? `<span class="online-status">🟢 online </span>` 
        : `<span class="offline-status">(last seen ${timeAgo(info.lastChanged)})</span>`;
      return `${info.email}${label} - ${status}`;
    });
    // Use innerHTML and <br> for line breaks
    document.getElementById("online-users").innerHTML = list.join("<br>");
  });
}



function timeAgo(timestamp) {
  if (!timestamp) return "";
  const timeNum = Number(timestamp);
  if (isNaN(timeNum)) return "";

  const diff = Math.floor((Date.now() - timeNum) / 1000);
  if (diff < 60) return diff + "s ago";
  const m = Math.floor(diff / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}


// Load all users into cache
function loadUsersCache() {
  const usersRef = ref(db, "users");
  get(usersRef)
    .then(snapshot => {
      usersCache = snapshot.exists() ? snapshot.val() : {};
    })
    .catch(console.error);
}

// Return profile pic URL or null (no pics here)
function getProfilePicOrLetter(email) {
  for (const uid in usersCache) {
    if (usersCache[uid].email === email) {
      return usersCache[uid].profilePic || null;
    }
  }
  return null;
}

// Create letter avatar SVG
function createLetterAvatar(email) {
  const letter = email.charAt(0).toUpperCase();
  const colors = ["#1abc9c", "#3498db", "#e67e22", "#9b59b6", "#e74c3c"];
  const color = colors[letter.charCodeAt(0) % colors.length];
  return `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#fff" dy=".35em" font-family="Arial" font-size="20">${letter}</text>
    </svg>
  `;
}

// Display a single chat message in chat container
function displayMessage(username, message, timestamp) {
  const chat = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = "message";

  // Profile pic or letter avatar
  const picUrl = getProfilePicOrLetter(username);

  if (picUrl) {
    div.innerHTML = `
      <img src="${picUrl}" class="profile-pic" alt="Profile Pic"/>
      <span class="username">${username}</span>
      <span class="text">${message}</span>
      <span class="timestamp">${timestamp}</span>
    `;
  } else {
    div.innerHTML = `
      <span class="profile-pic letter-avatar">${createLetterAvatar(username)}</span>
      <span class="username">${username}</span>
      <div class="text">${message}</div>
      <span class="timestamp">${timestamp}</span>
    `;
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Load chat messages in real time
function loadMessages() {
  const messagesRef = ref(db, "messages");
  onChildAdded(messagesRef, (snapshot) => {
    const msg = snapshot.val();
    if (!msg) return;
    displayMessage(msg.username, msg.message, msg.timestamp);
  });
}

// Signup handler
window.signup = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email and password are required");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      currentUser = user;
      // Save user info with null profilePic
      set(ref(db, `users/${user.uid}`), {
        email: user.email,
        profilePic: null
      }).then(() => {
        alert("Signup successful! You can now log in.");
      });
    })
    .catch(e => {
      alert("Signup Failed: " + e.message);
      console.error("Signup error:", e);
    });
};

// Login handler
window.login = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email and password are required");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .catch(e => alert("Login Failed: " + e.message));
};

// Send chat message handler
window.sendMessage = () => {
  if (!currentUser) {
    alert("You must be logged in to send messages.");
    return;
  }
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  push(ref(db, "messages"), {
    uid: currentUser.uid,
    username: currentUser.email,
    message: text,
    timestamp: new Date().toLocaleTimeString()
  });

  input.value = "";
};

// Logout handler
window.logout = () => {
  if (currentUser) updateOnlineStatus(currentUser.uid, false);
  signOut(auth);
};

// Listen for auth changes and update UI
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    updateOnlineStatus(user.uid, true);
    trackOnlineUsers();
    loadUsersCache();
    loadMessages();
  } else {
    currentUser = null;
    document.getElementById("auth-container").style.display = "block";
    document.getElementById("chat-container").style.display = "none";
  }
});
*/

// Firebase imports - using v9.22.2 as per your original code

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  set,
  onValue,
  onDisconnect,
  get,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your Firebase config object (replace with your actual config if different)
const firebaseConfig = {
  apiKey: "AIzaSyBblpZdFi8E3Lcf-4yEoJ3yhUonWmgpgyc",
  authDomain: "nexchat-8c980.firebaseapp.com",
  projectId: "nexchat-8c980",
  storageBucket: "nexchat-8c980.appspot.com",
  messagingSenderId: "87765028514",
  appId: "1:87765028514:web:26a575692fa3e343e491fb",
  databaseURL: "https://nexchat-8c980-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let currentUser = null;
let usersCache = {};

// --- Message Box Functions (Replacement for alert) ---
// Expose functions to the global window object
window.showMessageBox = (title, message) => {
  document.getElementById("message-box-title").innerText = title;
  document.getElementById("message-box-content").innerText = message;
  document.getElementById("message-box-overlay").classList.add("show");
};

window.hideMessageBox = () => {
  document.getElementById("message-box-overlay").classList.remove("show");
};

// Update user online status in DB
function updateOnlineStatus(uid, isOnline) {
  const statusRef = ref(db, `status/${uid}`);
  const statusData = {
    email: currentUser.email,
    state: isOnline ? "online" : "offline",
    lastChanged: serverTimestamp(),
  };
  set(statusRef, statusData)
    .then(() => {
      console.log(
        `User ${currentUser.email} status updated to ${
          isOnline ? "online" : "offline"
        }`
      );
    })
    .catch((error) => {
      console.error("Error updating online status:", error);
    });

  if (isOnline) {
    // On disconnect set user offline automatically
    onDisconnect(statusRef)
      .set({
        email: currentUser.email,
        state: "offline",
        lastChanged: serverTimestamp(),
      })
      .catch((error) => {
        console.error("Error setting onDisconnect:", error);
      });
  }
}

// Show online users with status and last seen
function trackOnlineUsers() {
  const statusRef = ref(db, "status");
  onValue(
    statusRef,
    (snapshot) => {
      const data = snapshot.val() || {};
      console.log("Firebase status data received:", data); // Debugging line
      const list = Object.entries(data)
        .map(([uid, info]) => {
          // Ensure info and its properties exist before accessing
          if (!info || !info.email || !info.state) {
            console.warn("Incomplete status data for UID:", uid, info);
            return ""; // Skip malformed entries
          }

          const isSelf = currentUser && uid === currentUser.uid;
          const label = isSelf ? " (You)" : "";
          const status =
            info.state === "online"
              ? `<span class="online-status">🟢 Online</span>`
              : `<span class="offline-status">(last seen ${timeAgo(
                  info.lastChanged
                )})</span>`;
          return `${info.email}${label}  ${status}`;
        })
        .filter((item) => item !== ""); // Filter out empty strings from malformed data

      document.getElementById("online-users").innerHTML = list.join("<br>");
    },
    (error) => {
      console.error("Error tracking online users:", error); // Error handling for onValue
    }
  );
}

function timeAgo(timestamp) {
  if (!timestamp) return "";
  // Firebase serverTimestamp returns a number (milliseconds since epoch)
  // If it's an object from serverTimestamp, access its value
  const timeNum =
    typeof timestamp === "object" && timestamp.hasOwnProperty(".sv")
      ? Date.now() // Placeholder until actual timestamp is available
      : Number(timestamp);

  if (isNaN(timeNum)) return "";

  const diff = Math.floor((Date.now() - timeNum) / 1000);

  if (diff < 60) return diff + "s ago";
  const m = Math.floor(diff / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

// Load all users into cache
function loadUsersCache() {
  const usersRef = ref(db, "users");
  get(usersRef)
    .then((snapshot) => {
      usersCache = snapshot.exists() ? snapshot.val() : {};
      console.log("Users cache loaded:", usersCache);
    })
    .catch(console.error);
}

// Return profile pic URL or null (no pics here)
function getProfilePicOrLetter(email) {
  for (const uid in usersCache) {
    if (usersCache[uid].email === email) {
      return usersCache[uid].profilePic || null;
    }
  }
  return null;
}

// Create letter avatar SVG
function createLetterAvatar(email) {
  const letter = email.charAt(0).toUpperCase();
  const colors = [
    "#1abc9c",
    "#3498db",
    "#e67e22",
    "#9b59b6",
    "#e74c3c",
    "#f1c40f",
    "#2ecc71",
    "#95a5a6",
    "#d35400",
    "#c0392b",
  ];
  const color = colors[letter.charCodeAt(0) % colors.length];
  return `
                <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="${color}"/>
                    <text x="50%" y="50%" text-anchor="middle" fill="#fff" dy=".35em" font-family="Arial" font-size="20">${letter}</text>
                </svg>
            `;
}

// Display a single chat message in chat container
function displayMessage(username, message, timestamp) {
  const chat = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = "message";

  // Profile pic or letter avatar
  const picUrl = getProfilePicOrLetter(username);

  let avatarHtml;
  if (picUrl) {
    avatarHtml = `<img src="${picUrl}" class="profile-pic" alt="Profile Pic"/>`;
  } else {
    avatarHtml = `<span class="profile-pic letter-avatar">${createLetterAvatar(
      username
    )}</span>`;
  }

  div.innerHTML = `
                ${avatarHtml}
                <span class="username">${username}</span>
                <div class="text">${message}</div>
                <span class="timestamp">${timestamp}</span>
            `;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Load chat messages in real time
function loadMessages() {
  const messagesRef = ref(db, "messages");
  onChildAdded(
    messagesRef,
    (snapshot) => {
      const msg = snapshot.val();
      if (!msg) return;
      displayMessage(msg.username, msg.message, msg.timestamp);
    },
    (error) => {
      console.error("Error loading messages:", error); // Error handling for onChildAdded
    }
  );
}

// Signup handler
window.signup = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    window.showMessageBox("Error", "Email and password are required.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      currentUser = user;
      // Save user info with null profilePic
      set(ref(db, `users/${user.uid}`), {
        email: user.email,
        profilePic: null,
      })
        .then(() => {
          window.showMessageBox(
            "Success",
            "Signup successful! You can now log in."
          );
        })
        .catch((e) => {
          console.error("Error saving user info:", e);
          window.showMessageBox(
            "Error",
            "Failed to save user info: " + e.message
          );
        });
    })
    .catch((e) => {
      window.showMessageBox("Signup Failed", e.message);
      console.error("Signup error:", e);
    });
};

// Login handler
window.login = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    window.showMessageBox("Error", "Email and password are required.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password).catch((e) =>
    window.showMessageBox("Login Failed", e.message)
  );
};

// Send chat message handler
window.sendMessage = () => {
  if (!currentUser) {
    window.showMessageBox("Error", "You must be logged in to send messages.");
    return;
  }
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  push(ref(db, "messages"), {
    uid: currentUser.uid,
    username: currentUser.email,
    message: text,
    timestamp: new Date().toLocaleTimeString(),
  })
    .then(() => {
      input.value = ""; // Clear input after sending
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      window.showMessageBox(
        "Error",
        "Failed to send message: " + error.message
      );
    });
};

// Logout handler
window.logout = () => {
  if (currentUser) {
    updateOnlineStatus(currentUser.uid, false);
  }
  signOut(auth)
    .then(() => {
      console.log("User logged out successfully.");
    })
    .catch((error) => {
      console.error("Error during logout:", error);
      window.showMessageBox("Error", "Failed to log out: " + error.message);
    });
};

// Listen for auth changes and update UI
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("chat-container").style.display = "flex"; // Use flex for chat container
    updateOnlineStatus(user.uid, true);
    trackOnlineUsers();
    loadUsersCache();
    loadMessages();
  } else {
    currentUser = null;
    document.getElementById("auth-container").style.display = "flex"; // Use flex for auth container
    document.getElementById("chat-container").style.display = "none";
    // Clear messages and online users when logged out
    document.getElementById("messages").innerHTML = "";
    document.getElementById("online-users").innerHTML = "";
  }
});
