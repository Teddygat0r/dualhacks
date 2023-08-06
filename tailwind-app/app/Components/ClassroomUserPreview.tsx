import { User } from "./types";
import Image from "next/image";

export default function ClassroomUserPreview({
    id,
    email,
    profile_picture,
    classes_att,
    classes_run,
    username,
}: User) {
    return (
        <div className="flex flex-grow gap-4 p-2 border border-opacity-50 rounded-lg border-slate-400">
            <div className="flex-grow-0 my-auto roudned-md">
                <Image
                    src={profile_picture}
                    alt="pfp"
                    width="32"
                    height="32"
                    className="rounded-md"
                ></Image>
            </div>
            <div className="flex flex-col justify-center grow">
                <h1 className="text-sm font-semibold">{username}</h1>
            </div>
        </div>
    );
}
