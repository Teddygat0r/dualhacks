import { Assignment } from "./types";
import Link from "next/link";
import { MdAssignment } from "react-icons/md";

interface ClassAssignmentProps extends Assignment {
    classUrl: string;
}

export default function ClassroomAssignment({
    name,
    fcnName,
    params,
    description,
    id,
    due,
    classUrl,
    testCases,
}: ClassAssignmentProps) {
    return (
        <Link href={`/classes/${classUrl}/a/${id}`}>
            <div className="flex pr-4 border border-opacity-50 rounded-lg border-slate-400 bg-slate-200">
                <div className="flex-grow-0 p-8 my-auto">
                    <MdAssignment></MdAssignment>
                </div>
                <div className="flex flex-col justify-center grow">
                    <h1 className="text-xl font-semibold">{name}</h1>
                    <p className="text-sm text-slate-600">
                        Due {due.toDateString()}
                    </p>
                </div>
            </div>
        </Link>
    );
}
