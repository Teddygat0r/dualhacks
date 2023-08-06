import { User } from "@/app/Components/types";
import {
    WithFieldValue,
    FirestoreDataConverter,
    DocumentData,
    SnapshotOptions,
} from "firebase/firestore";

const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: WithFieldValue<User>): DocumentData {
        return {
            email: user.email,
            username: user.username,
            profile_picture: user.profile_picture,
            classes_att: user.classes_att,
            classes_run: user.classes_run,
        };
    },
    fromFirestore(snapshot: DocumentData, options: SnapshotOptions): User {
        const data = snapshot.data(options);
        return {
            email: data.email,
            username: data.username,
            id: snapshot.id, 
            profile_picture: data.profile_picture,
            classes_att: data.classes_att,
            classes_run: data.classes_run,
        };
    },
};

export default userConverter;
