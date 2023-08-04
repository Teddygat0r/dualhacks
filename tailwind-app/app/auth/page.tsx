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

export default function Auth(red: string = "/") {
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
            router.push(red);
        } catch (err) {
            console.error(err);
        }
    };

    if (user) {
        router.push(red);
    } else {
        return (
            <div className="grid h-screen place-items-center">
                <div className="flex mb-28 items-center flex-col">
                    <p className="font-white">
                        Create an account or sign in with Google.
                    </p>
                    <br></br>
                    <button
                        className="bg-transparent hover:bg-blue-950 font-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                        onClick={signInWithGoogle}
                    >
                        Sign In With Google
                    </button>
                </div>
            </div>
        );
    }
}
