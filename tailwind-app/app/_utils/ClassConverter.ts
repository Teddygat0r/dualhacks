import { MyClass } from "@/app/Components/types";
import {
    WithFieldValue,
    FirestoreDataConverter,
    DocumentData,
    SnapshotOptions,
} from "firebase/firestore";

const classConverter: FirestoreDataConverter<MyClass> = {
    toFirestore(myclass: WithFieldValue<MyClass>): DocumentData {
        return {
            code: myclass.code,
            desc: myclass.desc,
            name: myclass.name,
            students: myclass.students,
            teacher: myclass.teacher,
        };
    },
    fromFirestore(snapshot: DocumentData, options: SnapshotOptions): MyClass {
        const data = snapshot.data(options);
        return {
            code: data.code,
            desc: data.desc,
            id: snapshot.id,
            name: data.name,
            students: data.students,
            teacher: data.teacher,
        };
    },
};

export default classConverter;
