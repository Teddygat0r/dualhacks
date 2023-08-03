"use client";
import { auth, googleProvider } from "@/firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Auth() {
    const [user] = useAuthState(auth);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };
    if (user) {
        return (
            <div>
                <p>Current User: {user.email}</p>
                <br></br>
                <button onClick={logout}>Logout</button>
            </div>
        );
    } else {
        return (
            <div>
                <button onClick={signInWithGoogle}>Sign In With Google</button>
            </div>
        );
    }
}
