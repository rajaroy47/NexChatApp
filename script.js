import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
    import {
      getAuth,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      signOut,
      onAuthStateChanged
    } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
    import {
      getDatabase,
      ref,
      push,
      onChildAdded,
      set,
      onValue,
      remove
    } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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

    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getDatabase(app);

    let currentUser = null;

    // Auth listeners
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user;
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("chat-container").style.display = "block";
        document.getElementById("welcome").innerText = "Welcome " + user.email;
        updateOnlineStatus(user.uid, true);
        loadMessages();
        trackOnlineUsers();
      } else {
        currentUser = null;
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("chat-container").style.display = "none";
      }
    });

    // Register user
    window.register = function () {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => alert("Registered successfully!"))
        .catch((error) => alert(error.message));
    };

    // Login user
    window.login = function () {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      signInWithEmailAndPassword(auth, email, password)
        .catch((error) => alert(error.message));
    };

    // Logout
    window.logout = function () {
      if (currentUser) updateOnlineStatus(currentUser.uid, false);
      signOut(auth);
    };

    // Send message
    window.sendMessage = function () {
      const msg = document.getElementById("messageInput").value.trim();
      if (msg === "") return;
      const timestamp = new Date().toLocaleTimeString();
      push(ref(db, "messages"), {
        username: currentUser.email,
        message: msg,
        timestamp: timestamp
      });
      document.getElementById("messageInput").value = "";
    };

    // Load messages
    function loadMessages() {
      const messagesDiv = document.getElementById("messages");
      messagesDiv.innerHTML = "";
      const messagesRef = ref(db, "messages");
      onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        msgDiv.innerHTML = `
          <span class="username">${data.username}</span>: 
          <span class="text">${data.message}</span>
          <span class="timestamp">${data.timestamp}</span>
        `;
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      });
    }

    // Update online status
    function updateOnlineStatus(uid, isOnline) {
      const userStatusRef = ref(db, "onlineUsers/" + uid);
      if (isOnline) {
        set(userStatusRef, currentUser.email);
      } else {
        remove(userStatusRef);
      }
    }

    // Show online users
    function trackOnlineUsers() {
      const onlineRef = ref(db, "onlineUsers");
      onValue(onlineRef, (snapshot) => {
        const users = snapshot.val() || {};
        const userList = Object.values(users).join(", ");
        document.getElementById("online-users").innerText = userList;
      });
    }