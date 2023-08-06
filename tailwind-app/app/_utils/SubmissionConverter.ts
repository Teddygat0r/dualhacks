import { Submission } from "@/app/Components/types";
import {
    WithFieldValue,
    FirestoreDataConverter,
    DocumentData,
    SnapshotOptions,
} from "firebase/firestore";

const submissionConverter: FirestoreDataConverter<Submission> = {
    toFirestore(Submission: WithFieldValue<Submission>): DocumentData {
        return {
            student: Submission.student,
            content: Submission.content,
            unitTestResult: Submission.unitTestResult,
        };
    },
    fromFirestore(
        snapshot: DocumentData,
        options: SnapshotOptions,
    ): Submission {
        const data = snapshot.data(options);
        return {
            student: data.student,
            content: data.content,
            id: snapshot.id,
            unitTestResult: data.unitTestResult,
        };
    },
};

export default submissionConverter;
