"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { firestore } from "@/firebase/firebase";
import {
    useDocumentDataOnce,
    useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import userConverter from "../_utils/UserConverter";
import { doc } from "@firebase/firestore";
import { User } from "../Components/types";
import Class from "../Components/Class";

/*
- load the user
- throw a loading screen until the user finishes loading
- 
- load all of the classes the user has and throw a loading screen until thats finished
- render the classes
*/

export default function Page() {
    // loads the user
    const [user, loading, error] = useAuthState(auth);

    const [snapshot, userLoading] = useDocumentDataOnce<User>(
        doc(firestore, "user", user ? user.uid : "0").withConverter(
            userConverter,
        ),
    );

    // if the user isn't logged in, send them to brazil(the home page)
    useEffect(() => {
        if (!loading && !user) {
            redirect("/");
        }
    }, [user, loading]);

    useEffect(() => {
        console.log(snapshot);
        console.log(userLoading);
    }, [snapshot, userLoading]);

    //get all the classes the user is in

    return loading ? (
        <>
            <div className="absolute top-[50%] left-[50%]">Loading...</div>
        </>
    ) : (
        <>
            <div className="w-[60%] flex flex-col gap-8"></div>
        </>
    );
}
