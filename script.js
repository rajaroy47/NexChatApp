//#############################
// Firebase version -  v9.22.2
//#############################

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
  sendEmailVerification,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

//########################
//Firebase configuaration
//########################

const firebaseConfig = {
  apiKey: "AIzaSyBblpZdFi8E3Lcf-4yEoJ3yhUonWmgpgyc",
  authDomain: "nexchat-8c980.firebaseapp.com",
  projectId: "nexchat-8c980",
  storageBucket: "nexchat-8c980.appspot.com",
  messagingSenderId: "87765028514",
  appId: "1:87765028514:web:26a575692fa3e343e3491fb",
  databaseURL: "https://nexchat-8c980-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let currentUser = null;
let usersCache = {};

// Expose functions to the global window object
window.showMessageBox = (title, message) => {
  document.getElementById("message-box-title").innerText = title;
  document.getElementById("message-box-content").innerText = message;
  document.getElementById("message-box-overlay").classList.add("show");
};

window.hideMessageBox = () => {
  document.getElementById("message-box-overlay").classList.remove("show");
};

// Update user online status
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
    // On disconnect user offline automatically
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
              : `<span class="offline-status">last seen ${timeAgo(
                  info.lastChanged
                )}</span>`;
          return `${info.email}${label} ${status}`;
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

  // ######################################################################
  // Firebase serverTimestamp returns a number (milliseconds since epoch)
  // If it's an object from serverTimestamp, access its value
  // ######################################################################
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
          <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="20" fill="${color}"/>
            <text x="50%" y="50%" text-anchor="middle" fill="#fff" dy=".35em" font-family="Arial" font-size="20">${letter}</text>
          </svg>
        `;
}

// Display a single chat message in chat container
function displayMessage(senderUsername, messageText, timestamp) {
  const chat = document.getElementById("messages");
  const div = document.createElement("div");

  // Check if the message is from the current user
  const isMyMessage = currentUser && senderUsername === currentUser.email;

  div.className = "message";
  if (isMyMessage) {
    div.classList.add("my-message");
  }

  // Profile pic or letter avatar
  const picUrl = getProfilePicOrLetter(senderUsername);

  let avatarHtml;
  if (picUrl) {
    avatarHtml = `<img src="${picUrl}" class="profile-pic" alt="Profile Pic"/>`;
  } else {
    avatarHtml = `<span class="profile-pic letter-avatar">${createLetterAvatar(
      senderUsername
    )}</span>`;
  }

  // Arrange elements based on whether it's my message or not
  if (isMyMessage) {
    div.innerHTML = `
              <span class="timestamp">${timestamp}</span>
              <div class="text">${messageText}</div>
              <span class="username">${senderUsername}</span>
              ${avatarHtml}
            `;
  } else {
    div.innerHTML = `
              ${avatarHtml}
              <span class="username">${senderUsername}</span>
              <div class="text">${messageText}</div>
              <span class="timestamp">${timestamp}</span>
            `;
  }

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
      // Pass the sender's username (email) and the message text
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
      // Send email verification
      sendEmailVerification(user)
        .then(() => {
          window.showMessageBox(
            "Success",
            "Signup successful! Please check your email to verify your account before logging in."
          );
          console.log("Verification email sent to:", user.email);
        })
        .catch((error) => {
          console.error("Error sending verification email:", error);
          window.showMessageBox(
            "Error",
            "Failed to send verification email: " + error.message
          );
        });

      // Save user info with null profilePic (do this after sending verification)
      set(ref(db, `users/${user.uid}`), {
        email: user.email,
        profilePic: null,
      })
        .then(() => {
          console.log("User info saved.");
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

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        signOut(auth).then(() => {
          window.showMessageBox(
            "Error",
            "Your email address is not verified. Please check your inbox and verify your email before logging in."
          );
        });
      }
      // onAuthStateChanged will handle UI updates upon successful (and verified) login
    })
    .catch((e) => {
      window.showMessageBox("Login Failed", e.message);
    });
};

// Password reset handler
window.resetPassword = () => {
  const email = document.getElementById("email").value.trim();
  if (!email) {
    window.showMessageBox("Error", "Please enter your email address to reset your password.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      window.showMessageBox(
        "Success",
        "Password reset email sent! Please check your inbox to reset your password."
      );
      console.log("Password reset email sent to:", email);
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
      window.showMessageBox("Error", "Failed to send password reset email: " + error.message);
    });
};

// Send chat message handler
window.sendMessage = () => {
  if (!currentUser) {
    window.showMessageBox("Error", "You must be logged in to send messages.");
    return;
  }
  if (!currentUser.emailVerified) {
    window.showMessageBox(
      "Error",
      "Your email address is not verified. You cannot send messages."
    );
    return;
  }
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  push(ref(db, "messages"), {
    uid: currentUser.uid, // Store UID to identify sender
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
  if (user && user.emailVerified) {
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

    // ##############################################
    // Clear messages and online users when logged out
    // ##############################################
    document.getElementById("messages").innerHTML = "";
    document.getElementById("online-users").innerHTML = "";
  }
});
