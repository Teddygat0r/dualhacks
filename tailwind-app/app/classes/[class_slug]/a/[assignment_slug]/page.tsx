/*

On page load check auth -- 
check if in class -- 
check if answer document has been created for current user

*/

"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import {
    doc,
    query,
    collection,
    where,
    getDocs,
    addDoc,
} from "firebase/firestore";
import { MyClass, User, Assignment, Submission } from "@/app/Components/types";
import classConverter from "@/app/_utils/ClassConverter";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import assignmentConverter from "@/app/_utils/AssignmentConverter";
import submissionConverter from "@/app/_utils/SubmissionConverter";
import ProblemDescription from "@/app/Components/ProblemDescription";
import CodeBlock from "@/app/Components/CodeBlock";
import userConverter from "@/app/_utils/UserConverter";
import Profile from "./profile";
import ViewSubmission from "./viewSubmission";

export default function Page({
    params,
}: {
    params: { class_slug: string; assignment_slug: string };
}) {
    const [user, authLoading] = useAuthState(auth);
    const [snapshot, classLoading] = useDocumentDataOnce<MyClass>(
        doc(firestore, "class", params.class_slug).withConverter(
            classConverter,
        ),
    );
    const [assignment, assignmentLoading] = useDocumentDataOnce<Assignment>(
        doc(
            firestore,
            `class/${params.class_slug}/assignment`,
            params.assignment_slug,
        ).withConverter(assignmentConverter),
    );

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [studentsList, setStudentsList] = useState<User[]>([]);
    const [selectedId, setSelectedId] = useState(-1);

    const isTeacher = useRef(false);
    isTeacher.current =
        snapshot?.teacher.id === user?.uid &&
        snapshot !== undefined &&
        snapshot !== null;

    const checkUserInClass = (userId: string, myclass: MyClass) => {
        if (
            !myclass.students
                .map((item) => {
                    return item.id;
                })
                .includes(userId) &&
            !(myclass.teacher.id === userId)
        ) {
            redirect("/");
        }
    };

    const handleProfileClick = (index: number) => {
        const id = studentsList[index].id;
        for (let i = 0; i < submissions.length; i++) {
            if (submissions[i].student.id === id) {
                setSelectedId(i);
                return;
            }
        }
        setSelectedId(-1);
    };

    useEffect(() => {
        if (!authLoading && !classLoading) {
            if (snapshot === undefined) redirect("/");
            if (!user) redirect("/");
            if (user && snapshot && assignment) {
                checkUserInClass(user.uid, snapshot);
                if (snapshot.teacher.id !== user.uid)
                    (async () => {
                        const q = query(
                            collection(
                                firestore,
                                `class/${params.class_slug}/assignment/${params.assignment_slug}/submission`,
                            ).withConverter(submissionConverter),
                            where(
                                "student",
                                "==",
                                doc(firestore, "users", user?.uid ?? "0"),
                            ),
                        );
                        const res = await getDocs(q);

                        if (res.size === 0) {
                            const sub: Submission = {
                                student: doc(firestore, "users", user.uid),
                                content: "",
                                unitTestResult: new Array(
                                    assignment?.testCases.length,
                                ).fill(false),
                                id: "",
                            };
                            const docsetted = await addDoc(
                                collection(
                                    firestore,
                                    `class/${params.class_slug}/assignment/${params.assignment_slug}/submission`,
                                ).withConverter(submissionConverter),
                                sub,
                            );
                            sub.id = docsetted.id;
                            setSubmission(sub);
                        } else {
                            setSubmission(res.docs[0].data());
                        }
                    })();
                else if (snapshot.teacher.id === user.uid) {
                    (async () => {
                        const q = query(
                            collection(
                                firestore,
                                `class/${params.class_slug}/assignment/${params.assignment_slug}/submission`,
                            ).withConverter(submissionConverter),
                        );
                        const res = await getDocs(q);
                        setSubmissions(res.docs.map((doc) => doc.data()));
                    })();
                    (async () => {
                        const q = query(
                            collection(firestore, `users`).withConverter(
                                userConverter,
                            ),
                            where(
                                "__name__",
                                "in",
                                snapshot.students.map((item) => item.id),
                            ),
                        );
                        const res = await getDocs(q);
                        setStudentsList(res.docs.map((doc) => doc.data()));
                    })();
                }
            }
        }
    }, [
        user,
        authLoading,
        snapshot,
        classLoading,
        params,
        assignment,
        assignmentLoading,
    ]);

    return (
        <main className="flex h-full grow">
            {assignment && submission && !isTeacher.current ? (
                <>
                    <div className="w-[50%] bg-slate-500">
                        <ProblemDescription
                            name={assignment.name}
                            desc={assignment.description}
                        ></ProblemDescription>
                    </div>
                    <div className="w-[50%] bg-slate-500">
                        <CodeBlock
                            fcnName={assignment.fcnName}
                            params={assignment.params}
                            testCases={assignment.testCases}
                            submission={submission}
                            baseUrl={`class/${params.class_slug}/assignment/${params.assignment_slug}/submission`}
                        ></CodeBlock>
                    </div>
                </>
            ) : (
                <div className="flex w-full bg-slate-500">
                    <div className="w-[20%] bg-slate-300 flex flex-col">
                        <div className="py-8 border-b border-slate-500">
                            <h1 className="text-xl font-bold text-center">
                                Students
                            </h1>
                        </div>
                        <div className="flex flex-col gap-2 mt-8">
                            {studentsList.map((std, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        handleProfileClick(index);
                                    }}
                                >
                                    <Profile user={std}></Profile>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grow">
                        {selectedId < submissions.length &&
                        selectedId !== -1 ? (
                            <ViewSubmission
                                submission={submissions[selectedId]}
                            ></ViewSubmission>
                        ) : (
                            <div className="flex h-full m-auto align-middle">
                                <p className="m-auto text-center text-white">
                                    Not Selected or not Student has not started
                                    assignment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
