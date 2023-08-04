"use client";
import { auth, googleProvider, firestore } from "@/firebase/firebase";
import {
    signInWithPopup,
    getAdditionalUserInfo,
    UserCredential,
    AdditionalUserInfo,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Auth() {
    const [user] = useAuthState(auth);
    let router = useRouter();
    const createUserObjectIfNotExists = async (result: UserCredential) => {
        const res = getAdditionalUserInfo(result);
        if (res === null) {
            return;
        }
        const { isNewUser }: AdditionalUserInfo = res;
        if (isNewUser) {
            await setDoc(doc(firestore, "users", result.user.uid), {
                username: result.user.displayName,
                email: result.user.email,
                classes_att: [],
                classes_run: [],
                profile_picture: result.user.photoURL,
            });
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await createUserObjectIfNotExists(result);
            router.push("/");
        } catch (err) {
            console.error(err);
        }
    };

    if (user) {
        router.push("/");
    } else {
        return (
            <div>
                <button onClick={signInWithGoogle}>Sign In With Google!</button>
            </div>
        );
    }
}