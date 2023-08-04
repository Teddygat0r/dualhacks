interface TestCaseOutput {
    input: string;
    output: string;
    stdout: string;
    stderr: string;
    index: number;
}

export default function TestCaseHolder({
    input,
    output,
    stdout,
    stderr,
    index,
}: TestCaseOutput) {
    return (
        <>
            <div>
                <p key={index}>{input}</p>
            </div>
        </>
    );
}
