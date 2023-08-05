import { DocumentReference } from "firebase/firestore";

export type InputOutput = {
    input: any[];
    output: any[];
};

export type TestCase = {
    input: string;
    output: string;
    hidden: boolean;
};

export type Problem = {
    name: string;
    fcnName: string;
    params: string;
    description: string;
    testCases: TestCase[];
};

export type MyClass = {
    code: string;
    desc: string;
    name: string;
    students: DocumentReference[];
    teacher: DocumentReference;
    id: string;
};

export type User = {
    email: string;
    profile_picture: string;
    username: string;
    classes_att: DocumentReference[];
    classes_run: DocumentReference[];
    id: string;
};

export interface Assignment extends Problem {
    due: Date;
    id: string;
}
