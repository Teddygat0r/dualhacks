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
import { redirect } from "next/navigation";
import userConverter from "@/app/_utils/UserConverter";
export default function MakeClass() {
    const [className, setClassName] = useState("");
    const [classDesc, setClassDesc] = useState("");
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (!loading && !user) {
            redirect("/");
        }
    }, [user, loading]);

    const addClass = async (cname: string, cdesc: string) => {
        // code to make random 10 digit code
        const length = 10;
        const characters = "0123456789qwertyuiopasdfghjklzxcvbnm";
        let classCode = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            classCode += characters[randomIndex];
        }

        if (className && classDesc) {
            const currentClass = await addDoc(collection(firestore, "class"), {
                name: cname,
                desc: cdesc,
                students: [], // :skull:
                teacher: doc(firestore, "users", user ? user.uid : "0"),
                code: classCode,
            });
            await updateDoc(doc(firestore, "users", user ? user.uid : "0"), {
                classes_run: arrayUnion(currentClass),
            });
            
            return currentClass.id;
        }

        return 0;
    };
    // name, code, desc, teacher,
    return (
        <>
            <br></br>
            <h1>
                <b className="text-xl">Create Classroom</b>
            </h1>
            <label>Name of Class:</label>
            <div className="flex flex-col flex-initial">
                <input
                    className="border border-black rounded-lg w-48"
                    value={className}
                    onChange={(e) => {
                        setClassName(e.target.value);
                    }}
                ></input>
            </div>
            <label>Description of Class:</label>
            <div className="flex flex-col flex-initial">
                <textarea
                    className="border border-black rounded-lg"
                    value={classDesc}
                    onChange={(e) => {
                        setClassDesc(e.target.value);
                    }}
                ></textarea>
            </div>
            <div>
                <button
                    className="inline-block px-4 py-2 mt-4 text-right text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
                    onClick={(() => addClass(className, classDesc))}
                >
                    Create
                </button>
            </div>
        </>
    );
}
