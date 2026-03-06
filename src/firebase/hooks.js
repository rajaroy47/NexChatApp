import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, db } from './config';
import { updateOnlineStatus, getDefaultName } from './db';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const prevUserRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.emailVerified) {
                setCurrentUser(user);
                if (!prevUserRef.current || prevUserRef.current.uid !== user.uid) {
                    updateOnlineStatus(user.uid, user.email, true);
                }
            } else {
                if (prevUserRef.current) {
                    updateOnlineStatus(prevUserRef.current.uid, prevUserRef.current.email, false);
                }
                if (user && !user.emailVerified) {
                    if (user.email) signOut(auth).catch(console.error); 
                }
                setCurrentUser(null);
            }
            prevUserRef.current = user;
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { currentUser, isLoading };
};

export const useMessages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const messagesRef = ref(db, "messages");

        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const messagesData = [];
            snapshot.forEach((childSnapshot) => {
                const msg = childSnapshot.val();
                if (msg) {
                    messagesData.push({ 
                        id: childSnapshot.key, 
                        ...msg 
                    });
                }
            });
            // Sort by timestamp to maintain correct order
            messagesData.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(messagesData);
        }, (error) => {
            console.error("Error loading global messages:", error);
        });

        return () => unsubscribe();
    }, []);

    return messages;
};

export const usePrivateMessages = (chatId) => {
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        const chatMessagesRef = ref(db, `chats/${chatId}/messages`);

        const unsubscribe = onValue(chatMessagesRef, (snapshot) => {
            const messagesData = [];
            snapshot.forEach((childSnapshot) => {
                const msg = childSnapshot.val();
                if (msg) {
                    messagesData.push({ 
                        id: childSnapshot.key, 
                        ...msg 
                    });
                }
            });
            // Sort by timestamp to maintain correct order
            messagesData.sort((a, b) => a.timestamp - b.timestamp);
            setMessages(messagesData);
        }, (error) => {
            console.error("Error loading private messages:", error);
        });

        return () => unsubscribe();
    }, [chatId]);

    return messages;
};

export const useUsersStatus = (currentUser) => {
    const [usersStatus, setUsersStatus] = useState({});

    useEffect(() => {
        if (!currentUser) return setUsersStatus({});

        const statusRef = ref(db, "status");

        const unsubscribe = onValue(statusRef, (snapshot) => {
            const data = snapshot.val() || {};
            setUsersStatus(data);
        }, (error) => {
            console.error("Error tracking user statuses:", error);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return usersStatus;
};

export const useUsersCache = () => {
    const [usersCache, setUsersCache] = useState({});
    
    useEffect(() => {
        const usersRef = ref(db, "users");
        
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const allUsers = {};
            snapshot.forEach(childSnapshot => {
                const userData = childSnapshot.val();
                allUsers[childSnapshot.key] = {
                    id: childSnapshot.key,
                    email: userData.email,
                    displayName: userData.displayName || getDefaultName(userData.email),
                    profilePic: userData.profilePic,
                };
            });
            setUsersCache(allUsers);
        }, (error) => {
            console.error("Error tracking user cache:", error);
        });

        return () => unsubscribe();
    }, []);

    return usersCache;
};