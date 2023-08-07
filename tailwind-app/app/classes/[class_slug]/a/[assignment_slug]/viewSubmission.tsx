import { Submission } from "@/app/Components/types";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

export default function ViewSubmission({
    submission,
}: {
    submission: Submission;
}) {
    return (
        <div className="flex h-full">
            <CodeMirror
                value={submission.content}
                extensions={[python()]}
                onChange={() => {}}
                minHeight="880px"
                className="h-full overflow-y-scroll w-[80%]"
            />
            <div className="grow">
                {submission.unitTestResult.map((value, index) => (
                    <div
                        key={index}
                        className="flex justify-center w-full gap-2 m-auto my-2"
                    >
                        <p className="my-auto font-semibold text-white">
                            Case {index + 1}:{" "}
                        </p>
                        <p
                            className={`rounded-lg px-4 py-2 ${
                                value ? "bg-green-500" : "bg-red-500"
                            }`}
                        >
                            {value ? "Passed" : "Not Passed"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
