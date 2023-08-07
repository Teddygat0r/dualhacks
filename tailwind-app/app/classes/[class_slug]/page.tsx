"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useEffect, useState, useRef } from "react";
import { redirect } from "next/navigation";
import {
    useDocumentDataOnce,
    useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import { firestore } from "@/firebase/firebase";
import {
    doc,
    collection,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { MyClass, Assignment, User } from "@/app/Components/types";
import classConverter from "@/app/_utils/ClassConverter";
import assignmentConverter from "@/app/_utils/AssignmentConverter";
import Image from "next/image";
import ClassroomAssignment from "@/app/Components/ClassroomAssignment";
import userConverter from "@/app/_utils/UserConverter";
import ClassroomUserPreview from "@/app/Components/ClassroomUserPreview";
import Link from "next/link";
import { BsPlusCircleDotted } from "react-icons/bs";

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

    const [students, setStudents] = useState<User[]>([]);
    const [teacher, setTeacher] = useState<User | null>(null);
    const isTeacher = useRef(false);
    isTeacher.current = teacher?.id === user?.uid && teacher !== null;

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
        }
    };

    useEffect(() => {
        if (!authLoading && !classLoading) {
            if (snapshot === undefined) redirect("/");
            if (!user) redirect("/");
            if (user && snapshot) {
                checkUserInClass(user.uid, snapshot);
                (async () => {
                    const q = query(
                        collection(firestore, "users").withConverter(
                            userConverter,
                        ),
                        where(
                            "__name__",
                            "in",
                            snapshot.students.map((item) => item.id),
                        ),
                    );
                    const classUsers = await getDocs(q);
                    let fbUserList: User[] = [];
                    classUsers.forEach((doc) => {
                        fbUserList.push(doc.data());
                    });

                    setStudents(fbUserList);
                })();
                (async () => {
                    const fbUser = await getDoc(
                        doc(
                            firestore,
                            "users",
                            snapshot.teacher.id,
                        ).withConverter(userConverter),
                    );
                    const data = fbUser.data();
                    if (data !== undefined) setTeacher(data);
                })();
            }
        }
    }, [user, authLoading, snapshot, classLoading]);

    return snapshot ? (
        <main className="flex flex-col flex-initial gap-2 py-12 m-auto px-[15%] bg-slate-300 flex-grow w-full">
            <div className="relative flex w-full py-12 mb-4 border border-black rounded-lg">
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
            <div className="relative flex gap-16 mx-8">
                <div className="w-[20%] flex flex-col gap-4">
                    <div className="p-4 border border-opacity-50 rounded-lg border-slate-400">
                        <h1 className="mb-2 text-sm font-bold">About:</h1>
                        <p>{snapshot.desc}</p>
                    </div>
                    {isTeacher.current && (
                        <div className="p-4 border border-opacity-50 rounded-lg border-slate-400">
                            <h1 className="mb-2 text-sm font-bold">
                                Class Code:
                            </h1>

                            <button
                                className="font-extrabold"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        snapshot.code,
                                    );
                                }}
                            >
                                {snapshot.code}
                            </button>
                        </div>
                    )}
                </div>
                <div className="w-[60%] flex flex-col gap-8">
                    {isTeacher.current ? (
                        <Link href={`/classes/${params.class_slug}/a/new`}>
                            <div className="flex pr-4 border border-opacity-50 rounded-lg border-slate-400 bg-slate-200">
                                <div className="flex-grow-0 p-4 my-auto border-r border-slate-700">
                                    <BsPlusCircleDotted></BsPlusCircleDotted>
                                </div>
                                <div className="flex flex-col justify-center grow">
                                    <h1 className="ml-4 text-xl font-semibold">
                                        Create new Assignment
                                    </h1>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <></>
                    )}
                    {assSnapshot?.map((item: Assignment) => {
                        return (
                            <ClassroomAssignment
                                key={item.id}
                                {...item}
                                classUrl={params.class_slug}
                            ></ClassroomAssignment>
                        );
                    })}
                </div>
                <div className="w-[20%]">
                    <div className="p-4 mb-4 border border-opacity-50 rounded-lg border-slate-400">
                        <h1 className="mb-2 text-sm font-bold">Teacher</h1>
                        <div className="flex flex-col gap-2">
                            {teacher ? (
                                <ClassroomUserPreview
                                    {...teacher}
                                ></ClassroomUserPreview>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className="p-4 border border-opacity-50 rounded-lg border-slate-400">
                        <h1 className="mb-2 text-sm font-bold">Members</h1>
                        <div className="flex flex-col gap-2">
                            {students?.map((item: User) => {
                                return (
                                    <ClassroomUserPreview
                                        key={item.id}
                                        {...item}
                                    ></ClassroomUserPreview>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    ) : (
        <>
            <div className="absolute top-[50%] left-[50%]">Loading...</div>
        </>
    );
}
