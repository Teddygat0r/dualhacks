"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { firestore } from "@/firebase/firebase";
import userConverter from "../_utils/UserConverter";
import { doc, getDoc } from "@firebase/firestore";
import { User } from "../Components/types";

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
    const [userObj, setUserObj] = useState<User | null>(null);

    // if the user isn't logged in, send them to brazil(the home page)
    useEffect(() => {
        if (!loading && !user) {
            redirect("/");
        } else if (user && !loading) {
            (async () => {
                const fbUser = await getDoc(
                    doc(firestore, "users", user.uid).withConverter(
                        userConverter,
                    ),
                );
                const data = fbUser.data();
                if (data !== undefined) setUserObj(data);
            })();
        }
    }, [user, loading]);

    useEffect(() => {
        console.log(userObj);
    }, [userObj]);

    //get all the classes the user is in

    return loading ? (
        <>
            <div className="absolute top-[50%] left-[50%]">Loading...</div>
        </>
    ) : (
        //TODO: go through every class the user is in and render it with the class.tsx thing
        <>
            <div className="w-[60%] flex flex-col gap-8"></div>
        </>
    );
}
