import { Assignment } from "./types";
import Link from "next/link";

interface ClassAssignmentProps extends Assignment {
    classUrl: string;
}

export default function ClassroomAssignment({
    name,
    fcnName,
    params,
    description,
    id,
    classUrl,
    testCases,
}: ClassAssignmentProps) {
    return (
        <Link href={`/classes/${classUrl}/a/${id}`}>
            <div className="px-4 py-2 border border-opacity-50 rounded-lg border-slate-400 bg-slate-200"></div>
        </Link>
    );
}
