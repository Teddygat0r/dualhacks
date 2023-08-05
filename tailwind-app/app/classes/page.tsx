"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function Page() {
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (!loading && !user) {
            redirect("/");
        }
    }, [user, loading]);

    return (
        <main className="flex flex-col flex-initial min-h-screen p-24">
            <div>hi</div>
        </main>
    );
}
