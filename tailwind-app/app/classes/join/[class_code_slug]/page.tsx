"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { useEffect } from "react";
import { MyClass, User } from "@/app/Components/types";
import {
    query,
    collection,
    where,
    updateDoc,
    doc,
    arrayUnion,
} from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import classConverter from "@/app/_utils/ClassConverter";
import { redirect } from "next/navigation";

export default function Page({
    params,
}: {
    params: { class_code_slug: string };
}) {
    const [user, loading, error] = useAuthState(auth);
    const [classes, classesLoading] = useCollectionDataOnce(
        query(
            collection(firestore, "class").withConverter(classConverter),
            where("code", "==", params.class_code_slug),
        ),
    );

    useEffect(() => {
        if (!user && !loading) {
            redirect("/");
        }
        if (user && classes) {
            (async () => {
                if (
                    classes.length > 0 &&
                    classes[0].teacher.id !== user.uid &&
                    !classes[0].students
                        .map((item) => item.id)
                        .includes(user.uid)
                ) {
                    await updateDoc(doc(firestore, "users", user.uid), {
                        classes_att: arrayUnion(
                            doc(firestore, "class", classes[0].id),
                        ),
                    });
                    await updateDoc(doc(firestore, "class", classes[0].id), {
                        students: arrayUnion(doc(firestore, "users", user.uid)),
                    });
                }
            })();
            redirect("/classes");
        }
    }, [user, loading, classes, classesLoading]);

    return <div>Success</div>;
}
