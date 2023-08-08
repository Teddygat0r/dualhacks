"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { firestore } from "@/firebase/firebase";
import userConverter from "../_utils/UserConverter";
import { doc, getDoc, getDocs } from "@firebase/firestore";
import { MyClass, User } from "../Components/types";
import { query, where, collection } from "firebase/firestore";
import Class from "../Components/Class";
import classConverter from "../_utils/ClassConverter";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";

export default function Page() {
    // loads the user
    const [user, loading, error] = useAuthState(auth);
    const [userObj, setUserObj] = useState<User | null>(null);

    const [classes, setClasses] = useState<MyClass[]>([]);
    const [snapshot, userLoading] = useDocumentDataOnce<User>(
        doc(firestore, "user", user ? user.uid : "0").withConverter(
            userConverter,
        ),
    );

    // if the user isn't logged in, send them to brazil(the home page)
    // otherwise get the user
    useEffect(() => {
        if (!loading && !user) {
            redirect("/");
        } else if (user && !loading) {
            (async () => {
                const fbUser = await getDoc(
                    doc(
                        firestore,
                        "users",
                        user ? user.uid : "0",
                    ).withConverter(userConverter),
                );
                const data = fbUser.data();
                if (data !== undefined) setUserObj(data);
            })();
        }
    }, [user, loading]);
    useEffect(() => {
        if (
            userObj != null &&
            userObj.classes_att.concat(userObj.classes_run).length !== 0
        ) {
            (async () => {
                const q = query(
                    collection(firestore, "class").withConverter(
                        classConverter,
                    ),
                    where(
                        "__name__",
                        "in",
                        userObj.classes_att
                            .concat(userObj.classes_run)
                            .map((item) => item.id),
                    ),
                );
                const classReturn = await getDocs(q);
                let fbClassList: MyClass[] = [];
                classReturn.docs.forEach((doc) => {
                    fbClassList.push(doc.data());
                });
                setClasses(fbClassList);
            })();
        }
    }, [userObj]);

    //get all the classes the user is in
    if (loading) {
        return (
            <>
                <div className="absolute top-[50%] left-[50%]">
                    Loading User...
                </div>
            </>
        );
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center gap-8">
                <h1 className="mx-auto my-8 text-4xl font-bold">My Classes</h1>
                <div>
                    <a
                        href="/classes/create"
                        className="inline-block px-4 py-2 mt-4 text-right text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        Create a Classroom
                    </a>
                </div>
                <div className="flex flex-wrap gap-8">
                    {classes ? (
                        classes.map((item: MyClass) => {
                            return <Class key={item.id} {...item}></Class>;
                        })
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
}
