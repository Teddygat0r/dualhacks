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
    const [teacher, setTeacher] = useState<User | null>(null);
    const isTeacher = useRef(false);
    isTeacher.current = teacher?.id === user?.uid && teacher?.id !== null;

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
            if (user && snapshot && assignment) {
                checkUserInClass(user.uid, snapshot);
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
            {assignment && submission ? (
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
                <div>hi</div>
            )}
        </main>
    );
}
