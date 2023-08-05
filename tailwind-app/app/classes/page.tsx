"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { firestore } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Page() {
    const [user, loading, error] = useAuthState(auth);
    const [userObj, setUserObj] = useState({});

    const [snapshot, userLoading] = useDocumentDataOnce(
        doc(firestore, "user", auth.currentUser?.uid ?? "0"),
    );

    useEffect(() => {
        if (!loading && !user) {
            redirect("/");
        } else if (user) {
            const fetchData = async () => {
                const data = await getDoc(
                    doc(firestore, "users", user?.uid ?? "0"),
                );
                if (data.exists()) {
                    console.log(data.data());
                }
                console.log(data);
                console.log(user?.uid ?? "0");
            };
            fetchData();
        }
    }, [user, loading]);

    useEffect(() => {});

    return (
        <main className="flex flex-col flex-initial min-h-screen p-24">
            <div>hi</div>
        </main>
    );
}
