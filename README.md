# NexChat 💬

<div align="center">

![NexChat Banner](https://github.com/rajaroy47/NexChatApp/blob/main/public/banner-nexchat.png)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.23.0-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

A modern, real-time chat application with beautiful UI, private messaging, and seamless user experience.

[Live Demo](https://nex-chat-app-sable.vercel.app) · [Report Bug](https://github.com/rajaroy47/nexchat/issues) · [Request Feature](https://github.com/rajaroy47/nexchat/issues)

</div>

## ✨ Features

### 🚀 Core Features
- **Real-time Messaging** - Instant message delivery powered by Firebase
- **Global & Private Chats** - Both public rooms and one-on-one conversations
- **User Authentication** - Secure email/password login with verification
- **Online Status** - Live user presence indicators
- **Message Management** - Delete your own messages with confirmation

### 🎨 User Experience
- **Dark Theme** - Eye-friendly dark mode interface
- **Responsive Design** - Flawless experience on all devices
- **Emoji Picker** - Quick access to popular emojis
- **Typing Indicators** - See when others are typing
- **Admin System** - Special badges and privileges

### 🔒 Security & Privacy
- **Email Verification** - Required for account activation
- **Secure Authentication** - Firebase Auth with proper validation
- **Private Conversations** - End-to-end encrypted private chats
- **Message Deletion** - Permanent removal with confirmation

### 👥 Social Features
- **User Profiles** - Custom display names and auto-generated avatars
- **Last Seen** - Track when users were last active
- **Online Users** - Real-time user status tracking
- **User Search** - Find and connect with other users

## 🎯 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajaroy47/nexchat.git
   cd nexchat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env-example .env
   
   # Edit with your Firebase config
   nano .env
   ```

4. **Firebase Configuration**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Set up Realtime Database
   - Copy config to `.env`

5. **Run the application**
   ```bash
   npm run dev
   ```
   
6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the setup wizard
3. Note your Project ID

### 2. Enable Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Configure authorized domains

### 3. Setup Realtime Database
1. Go to **Realtime Database**
2. Create database in **locked mode**
3. Update rules (see below)

### 4. Get Configuration
1. Go to **Project settings** > **General**
2. Scroll to **Your apps**
3. Add web app and copy `firebaseConfig`

### Environment Variables
Create `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

### Database Rules
```javascript
{
  "rules": {
    "messages": {
      "$messageId": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() || data.child('uid').val() == auth.uid)"
      }
    },
    "chats": {
      "$chatId": {
        ".read": "auth != null && root.child('chats/'+$chatId+'/participants').child(auth.uid).exists()",
        ".write": "auth != null && root.child('chats/'+$chatId+'/participants').child(auth.uid).exists()"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "status": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

## 🏗️ Project Structure

```
nexchat/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   │   └── AuthScreen.jsx
│   │   ├── chat/          # Chat functionality
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── Message.jsx
│   │   │   └── UserList.jsx
│   │   └── common/        # Shared components
│   │       ├── Avatar.jsx
│   │       ├── AdminBadge.jsx
│   │       ├── EmojiPicker.jsx
│   │       ├── SettingsModal.jsx
│   │       └── ConfirmationModal.jsx
│   ├── firebase/          # Firebase configuration
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── db.js
│   │   └── hooks.js
│   ├── pages/             # Page components
│   │   └── ChatPage.jsx
│   ├── App.jsx            # Root component
│   └── main.jsx           # Application entry point
├── .env.example           # Environment template
├── package.json
└── vite.config.js         # Vite configuration
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables in Vercel**
   Add all `VITE_FIREBASE_*` variables in Vercel project settings.

### Manual Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create account with email verification
2. **Set Display Name**: Choose your chat identity
3. **Explore Global Chat**: Join public conversations
4. **Start Private Chat**: Click any user for one-on-one

### Chat Features
- **Send Messages**: Type and press Enter or click send
- **Use Emojis**: Click emoji button for quick reactions
- **Delete Messages**: Hover over your messages and click ×
- **User Status**: See who's online in real-time

### User Management
- **Update Profile**: Change display name in settings
- **Change Password**: Secure password updates
- **Privacy**: Control your online visibility

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Architecture
- **Components**: Functional React components with hooks
- **State Management**: React useState and useEffect
- **Real-time Updates**: Firebase onValue listeners
- **Styling**: Tailwind CSS with custom components

### Key Technologies
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Firebase Auth, Realtime Database
- **Build Tool**: Vite for fast development
- **Deployment**: Vercel for seamless hosting

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use meaningful component and variable names
- Follow React best practices
- Ensure responsive design
- Test on multiple devices

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection**
```bash
# Check environment variables
echo $VITE_FIREBASE_API_KEY

# Verify Firebase project setup
# Check database rules
```

**Authentication Problems**
- Ensure email verification is completed
- Check Firebase Auth is enabled
- Verify authorized domains

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Check Node.js version
node --version
```

### Getting Help
1. Check [existing issues](https://github.com/rajaroy47/nexchat/issues)
2. Create a new issue with details
3. Include error logs and steps to reproduce

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Raja Roy**
- 💼 [LinkedIn](https://www.linkedin.com/in/rajaroy47)
- 🐙 [GitHub](https://github.com/rajaroy47)
- 📷 [Instagram](https://www.instagram.com/raja_roy47)

## 🙏 Acknowledgments

- Firebase team for excellent real-time infrastructure
- React community for comprehensive documentation
- Vite team for the amazing build tool
- Tailwind CSS for utility-first styling
- Vercel for seamless deployment

## 📞 Support

If you need help with setup or have questions:
- 📧 Email: [mrajaroy.47@gmail.com]
- 🐛 [Create an Issue](https://github.com/rajaroy47/nexchat/issues)
- 💬 [Discussion Forum](https://github.com/rajaroy47/nexchat/discussions)

---

<div align="center">

### ⭐ Don't forget to star this repo if you find it helpful!

**Built with ❤️ using React and Firebase**

[![GitHub stars](https://img.shields.io/github/stars/rajaroy47/nexchat?style=social)](https://github.com/rajaroy47/nexchat/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/rajaroy47/nexchat?style=social)](https://github.com/rajaroy47/nexchat/network/members)
[![GitHub issues](https://img.shields.io/github/issues/rajaroy47/nexchat)](https://github.com/rajaroy47/nexchat/issues)

</div>
