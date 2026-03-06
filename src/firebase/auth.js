import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updatePassword,
    EmailAuthProvider, 
    reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from './config';

export const authMethods = {
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signup: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    sendVerification: (user) => sendEmailVerification(user),
};

export const updateUserPassword = async (currentUser, currentPassword, newPassword) => {
    if (!currentUser || !currentPassword || !newPassword || newPassword.length < 6) {
        return Promise.reject(new Error("Invalid input or new password too short (min 6 chars)."));
    }

    const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
    );

    try {
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
        return 'Password updated successfully!';
    } catch (error) {
        if (error.code === 'auth/wrong-password') {
            throw new Error("Incorrect current password. Please try again.");
        }
        if (error.code === 'auth/requires-recent-login') {
            throw new Error("Requires recent login. Please sign in again."); 
        }
        if (error.code === 'auth/weak-password') {
            throw new Error("The new password is too weak (min 6 characters).");
        }
        console.error("Firebase Password Update Error:", error);
        throw new Error(`Failed to update password: ${error.message}`);
    }
};