import { Submission } from "@/app/Components/types";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

export default function ViewSubmission({
    submission,
}: {
    submission: Submission;
}) {
    return (
        <div>
            <CodeMirror
                value={submission.content}
                extensions={[python()]}
                onChange={() => {}}
                minHeight="700px"
                className="h-full overflow-y-scroll"
            />
            <div></div>
        </div>
    );
}
