// import React, { useRef, useEffect } from 'react';
// import Message from './Message';

// export const ChatWindow = ({ messages, currentUser, usersCache, selectedChatPartner }) => {
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//         <main className="flex-1 p-4 overflow-y-auto space-y-4 bg-chat-panel custom-scrollbar">
//             {messages
//                 .sort((a, b) => a.timestamp - b.timestamp) 
//                 .map((msg) => {
//                     return (
//                         <Message
//                             key={msg.id}
//                             message={msg}
//                             isMyMessage={(msg.senderUid || msg.uid) === currentUser.uid}
//                             usersCache={usersCache}
//                         />
//                     );
//                 })}
//             <div ref={messagesEndRef} />
//             {messages.length === 0 && selectedChatPartner && (
//                 <div className="text-center text-gray-400 p-8 border-2 border-dashed border-purple-900 bg-gray-800 rounded-xl mt-8">
//                     <p className="text-lg font-semibold text-white">Start your private conversation! 💬</p>
//                     <p className="text-sm">Only you and {selectedChatPartner.displayName} can see these messages.🔒</p>
//                 </div>
//             )}
//         </main>
//     );
// };

// export default ChatWindow;


import React, { useRef, useEffect } from 'react';
import Message from './Message';

export const ChatWindow = ({ messages, currentUser, usersCache, selectedChatPartner, chatId }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <main className="flex-1 p-4 overflow-y-auto space-y-4 bg-chat-panel custom-scrollbar">
            {messages
                .sort((a, b) => a.timestamp - b.timestamp) 
                .map((msg) => {
                    return (
                        <Message
                            key={msg.id}
                            message={msg}
                            isMyMessage={(msg.senderUid || msg.uid) === currentUser.uid}
                            usersCache={usersCache}
                            currentUser={currentUser}
                            selectedChatPartner={selectedChatPartner}
                            chatId={chatId}
                        />
                    );
                })}
            <div ref={messagesEndRef} />
            {messages.length === 0 && selectedChatPartner && (
                <div className="text-center text-gray-400 p-8 border-2 border-dashed border-purple-900 bg-gray-800 rounded-xl mt-8">
                    <p className="text-lg font-semibold text-white">Start your private conversation! 💬</p>
                    <p className="text-sm">Only you and {selectedChatPartner.displayName} can see these messages.🔒</p>
                </div>
            )}
        </main>
    );
};

export default ChatWindow;