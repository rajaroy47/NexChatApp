// import { ref, push, set, update, serverTimestamp, onDisconnect, onChildAdded, onValue, remove } from 'firebase/database';
// import { db } from './config';

// export const getChatId = (uid1, uid2) => {
//     return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
// };

// export const getDefaultName = (email) => (email ? email.split('@')[0] : 'Guest');

// export const updateOnlineStatus = (uid, email, isOnline) => {
//     if (!uid || !email) return;

//     const statusRef = ref(db, `status/${uid}`);
//     const statusData = {
//         email,
//         state: isOnline ? "online" : "offline",
//         lastChanged: serverTimestamp(),
//     };

//     set(statusRef, statusData).catch((error) =>
//         console.error("Error updating online status:", error)
//     );

//     if (isOnline) {
//         onDisconnect(statusRef)
//             .set({
//                 email,
//                 state: "offline",
//                 lastChanged: serverTimestamp(),
//             })
//             .catch((error) => console.error("Error setting onDisconnect:", error));
//     }
// };

// // export const sendMessage = (uid, displayName, message) => {
// //     if (!displayName || !message.trim()) return;

// //     return push(ref(db, "messages"), {
// //         uid,
// //         displayName, 
// //         message: message.trim(),
// //         timestamp: Date.now(),
// //     });
// // };


// // global send message code -------
// export const sendMessage = (uid, displayName, message) => {
//     const text = message.trim();
//     if (!displayName || !text) return;

//     return push(ref(db, "messages"), {
//         senderUid: uid,
//         senderDisplayName: displayName,
//         message: text,
//         timestamp: Date.now(),
//         status: "sent"
//     });
// };





// /*
// export const sendPrivateMessage = (senderUid, senderDisplayName, receiverUid, message) => {
//     if (!message.trim() || !senderUid || !receiverUid) return;
//     const chatId = getChatId(senderUid, receiverUid);

//     // this is old code -------
//     // return push(ref(db, `chats/${chatId}/messages`), {
//     //     senderUid,
//     //     senderDisplayName,
//     //     message: message.trim(),
//     //     timestamp: Date.now(),
//     // });

//     // new code for support doubule tick and typing indicator ------
//     return push(ref(db, `chats/${chatId}/messages`), {
//         message,
//         senderUid,
//         senderDisplayName,
//         timestamp: Date.now(),
//         status: "sent"
//     });
// };
// */

// // private send message code ------
// export const sendPrivateMessage = (senderUid, senderDisplayName, receiverUid, message) => {
//     const text = message.trim();
//     if (!text || !senderUid || !receiverUid) return;

//     const chatId = getChatId(senderUid, receiverUid);

//     return push(ref(db, `chats/${chatId}/messages`), {
//         message: text,
//         senderUid,
//         senderDisplayName,
//         timestamp: Date.now(),
//         status: "sent"
//     });
// };


// export const saveUserInfo = (uid, email, displayName) => {
//     const finalDisplayName = displayName.trim() || getDefaultName(email);
//     return set(ref(db, `users/${uid}`), {
//         email: email,
//         displayName: finalDisplayName, 
//         profilePic: null,
//     });
// };

// export const updateDisplayName = (uid, newDisplayName) => {
//     if (!uid || !newDisplayName.trim()) return Promise.reject(new Error("Invalid display name."));
//     return update(ref(db, `users/${uid}`), {
//         displayName: newDisplayName.trim(),
//     });
// };

// // NEW: Delete message functions
// export const deleteMessage = (messageId) => {
//     if (!messageId) return Promise.reject(new Error("Message ID is required."));
    
//     const messageRef = ref(db, `messages/${messageId}`);
//     return remove(messageRef);
// };

// export const deletePrivateMessage = (chatId, messageId) => {
//     if (!chatId || !messageId) return Promise.reject(new Error("Chat ID and Message ID are required."));
    
//     const messageRef = ref(db, `chats/${chatId}/messages/${messageId}`);
//     return remove(messageRef);
// };



import {
    ref,
    push,
    set,
    update,
    serverTimestamp,
    onDisconnect,
    remove
} from "firebase/database";

import { db } from "./config";


// generate chat id
export const getChatId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

export const getDefaultName = (email) =>
    email ? email.split("@")[0] : "Guest";


// =========================
// ONLINE STATUS
// =========================

export const updateOnlineStatus = (uid, email, isOnline) => {
    if (!uid || !email) return;

    const statusRef = ref(db, `status/${uid}`);

    const statusData = {
        email,
        state: isOnline ? "online" : "offline",
        lastChanged: serverTimestamp(),
    };

    set(statusRef, statusData);

    if (isOnline) {
        onDisconnect(statusRef).set({
            email,
            state: "offline",
            lastChanged: serverTimestamp(),
        });
    }
};


// =========================
// GLOBAL MESSAGE
// =========================

export const sendMessage = (uid, displayName, message) => {
    const text = message.trim();
    if (!displayName || !text) return;

    return push(ref(db, "messages"), {
        senderUid: uid,
        senderDisplayName: displayName,
        message: text,
        timestamp: Date.now(),
        status: "sent"
    });
};


// =========================
// PRIVATE MESSAGE
// =========================

export const sendPrivateMessage = (
    senderUid,
    senderDisplayName,
    receiverUid,
    message
) => {

    const text = message.trim();

    if (!text || !senderUid || !receiverUid) return;

    const chatId = getChatId(senderUid, receiverUid);

    return push(ref(db, `chats/${chatId}/messages`), {
        message: text,
        senderUid,
        senderDisplayName,
        timestamp: Date.now(),
        status: "sent"
    });
};


// =========================
// MESSAGE STATUS
// =========================


// ✓✓ Delivered
export const markMessageDelivered = (chatId, messageId) => {

    if (!chatId || !messageId) return;

    const messageRef = ref(db, `chats/${chatId}/messages/${messageId}`);

    update(messageRef, {
        status: "delivered"
    });

};


// ✓✓ Blue Read
export const markMessageRead = (chatId, messageId) => {

    if (!chatId || !messageId) return;

    const messageRef = ref(db, `chats/${chatId}/messages/${messageId}`);

    update(messageRef, {
        status: "read"
    });

};



// =========================
// TYPING INDICATOR
// =========================


export const setTypingStatus = (chatId, uid, isTyping) => {

    const typingRef = ref(db, `typing/${chatId}/${uid}`);

    if (isTyping) {
        set(typingRef, true);
    } else {
        remove(typingRef);
    }

};



// =========================
// USER INFO
// =========================


export const saveUserInfo = (uid, email, displayName) => {

    const finalDisplayName =
        displayName.trim() || getDefaultName(email);

    return set(ref(db, `users/${uid}`), {
        email,
        displayName: finalDisplayName,
        profilePic: null
    });

};


export const updateDisplayName = (uid, newDisplayName) => {

    if (!uid || !newDisplayName.trim())
        return Promise.reject(new Error("Invalid display name"));

    return update(ref(db, `users/${uid}`), {
        displayName: newDisplayName.trim()
    });

};



// =========================
// DELETE MESSAGE
// =========================


export const deleteMessage = (messageId) => {

    if (!messageId)
        return Promise.reject(new Error("Message ID required"));

    return remove(ref(db, `messages/${messageId}`));

};


export const deletePrivateMessage = (chatId, messageId) => {

    if (!chatId || !messageId)
        return Promise.reject(new Error("Chat ID required"));

    return remove(ref(db, `chats/${chatId}/messages/${messageId}`));

};

