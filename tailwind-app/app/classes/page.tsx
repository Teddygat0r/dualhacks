"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Page() {
    const [user] = useAuthState(auth);
    useEffect(() => {
        if (!user) redirect("/");
    });

    return (
        <main className="flex flex-col flex-initial min-h-screen p-24">
            <div className="text-xl">
                hi do you wanna see some of ur classes, well it looks like u have skill issue syndrome
            </div>
        </main>
    );
}
