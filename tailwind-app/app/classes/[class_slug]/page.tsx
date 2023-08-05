"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import {
    useDocumentDataOnce,
    useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import { firestore } from "@/firebase/firebase";
import { doc, collection } from "firebase/firestore";
import { MyClass, Assignment } from "@/app/Components/types";
import classConverter from "@/app/_utils/ClassConverter";
import assignmentConverter from "@/app/_utils/AssignmentConverter";
import Image from "next/image";
import ClassroomAssignment from "@/app/Components/ClassroomAssignment";

export default function Page({ params }: { params: { class_slug: string } }) {
    const [user, authLoading] = useAuthState(auth);
    const [snapshot, classLoading] = useDocumentDataOnce<MyClass>(
        doc(firestore, "class", params.class_slug).withConverter(
            classConverter,
        ),
    );
    const [assSnapshot, assLoading] = useCollectionDataOnce<Assignment>(
        collection(
            firestore,
            `class/${params.class_slug}/assignment`,
        ).withConverter(assignmentConverter),
    );

    const [isTeacher, setIsTeacher] = useState(false);

    const checkUserInClass = (userId: string, myclass: MyClass) => {
        if (
            !myclass.students
                .map((item) => {
                    return item.id;
                })
                .includes(userId) &&
            !(myclass.teacher.id == userId)
        ) {
            redirect("/");
        } else {
            setIsTeacher(myclass.teacher.id == userId);
        }
    };

    useEffect(() => {
        if (!authLoading && !classLoading) {
            if (snapshot === undefined) redirect("/");
            if (!user) redirect("/");
            if (user && snapshot) {
                checkUserInClass(user.uid, snapshot);
            }
        }
    }, [user, authLoading, snapshot, classLoading]);

    return snapshot ? (
        <main className="flex flex-col flex-initial gap-4 py-12 px-96 bg-slate-300">
            <div className="relative flex w-full py-12 border border-black rounded-lg">
                <Image
                    src="/stacked_waves.svg"
                    alt=""
                    className="absolute top-0 object-cover w-full h-full rounded-lg"
                    width="600"
                    height="400"
                />
                <h1 className="z-10 m-auto text-4xl font-semibold text-center text-white">
                    {snapshot.name}
                </h1>
            </div>
            <div className="relative flex gap-16">
                <div className="w-[20%]">
                    <div className="p-4 border border-opacity-50 rounded-lg border-slate-400">
                        <h1 className="mb-2 text-sm font-bold">About:</h1>
                        <p>{snapshot.desc}</p>
                    </div>
                </div>
                <div className="w-[60%] flex flex-col gap-8">
                    {assSnapshot ? (
                        assSnapshot.map((item: Assignment) => {
                            return (
                                <ClassroomAssignment
                                    key={item.id}
                                    {...item}
                                    classUrl={params.class_slug}
                                ></ClassroomAssignment>
                            );
                        })
                    ) : (
                        <></>
                    )}
                </div>
                <div className="w-[20%]">right</div>
            </div>
        </main>
    ) : (
        <>
            <div className="absolute top-[50%] left-[50%]">Loading...</div>
        </>
    );
}
