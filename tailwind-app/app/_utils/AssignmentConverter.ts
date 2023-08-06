import { Assignment } from "@/app/Components/types";
import {
    WithFieldValue,
    FirestoreDataConverter,
    DocumentData,
    SnapshotOptions,
} from "firebase/firestore";

const assignmentConverter: FirestoreDataConverter<Assignment> = {
    toFirestore(Assignment: WithFieldValue<Assignment>): DocumentData {
        return {
            fcnName: Assignment.fcnName,
            params: Assignment.params,
            name: Assignment.name,
            description: Assignment.description,
            due: Assignment.due,
            testCases: Assignment.testCases,
        };
    },
    fromFirestore(
        snapshot: DocumentData,
        options: SnapshotOptions,
    ): Assignment {
        const data = snapshot.data(options);
        const date = new Date(1970, 0, 1);
        date.setSeconds(data.due.seconds);
        return {
            fcnName: data.fcnName,
            params: data.params,
            name: data.name,
            description: data.description,
            due: date,
            id: snapshot.id,
            testCases: data.testCases,
        };
    },
};

export default assignmentConverter;
