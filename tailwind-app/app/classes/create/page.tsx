"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
    doc,
    addDoc,
    collection,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
} from "@firebase/firestore";
import { firestore, auth } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import userConverter from "@/app/_utils/UserConverter";
export default function MakeClass() {
    const [className, setClassName] = useState("");
    const [classDesc, setClassDesc] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const { push } = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            redirect("/");
        }
    }, [user, loading]);

    const addClass = () => {
        // code to make random 10 digit code
        const length = 10;
        const characters = "0123456789qwertyuiopasdfghjklzxcvbnm";
        let classCode = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            classCode += characters[randomIndex];
        }
        if (className && classDesc) {
            (async () => {
                const currentClass = await addDoc(
                    collection(firestore, "class"),
                    {
                        name: className,
                        desc: classDesc,
                        students: [], // :skull:
                        teacher: doc(firestore, "users", user ? user.uid : "0"),
                        code: classCode,
                    },
                );
                await updateDoc(
                    doc(firestore, "users", user ? user.uid : "0"),
                    {
                        classes_run: arrayUnion(currentClass),
                    },
                );
            })();
        }
        push("/classes");
    };
    // name, code, desc, teacher,
    return (
        <div className="flex flex-col w-full h-full gap-4 m-auto text-center">
            <br></br>
            <h1>
                <b className="text-xl">Create Classroom</b>
            </h1>

            <div className="flex-initial">
                <label>Name of Class:</label>
                <br />
                <input
                    className="w-48 px-4 py-2 m-auto border border-black rounded-lg"
                    value={className}
                    onChange={(e) => {
                        setClassName(e.target.value);
                    }}
                ></input>
            </div>
            <label>Description of Class:</label>
            <div className="flex flex-col flex-grow">
                <textarea
                    className="border border-black rounded-lg w-[50%] m-auto px-4 py-2 h-40"
                    value={classDesc}
                    onChange={(e) => {
                        setClassDesc(e.target.value);
                    }}
                ></textarea>
            </div>
            <div>
                <button
                    className="inline-block px-4 py-2 mt-4 text-right text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
                    onClick={() => {
                        addClass();
                    }}
                >
                    Create
                </button>
            </div>
        </div>
    );
}
