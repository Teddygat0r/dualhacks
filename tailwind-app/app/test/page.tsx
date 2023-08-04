import { Problem } from "@/Components/types";
import CodeBlock from "@/Components/CodeBlock";

export default function Page() {
    const MyProblem: Problem = {
        name: "My Problem",
        fcnName: "addNums",
        params: "num1, num2",
        description: "ad num",
        testCases: [
            {
                input: "1, 2",
                output: "3",
                hidden: false,
            },
            {
                input: "4, 5",
                output: "9",
                hidden: false,
            },
            {
                input: "7, 14",
                output: "21",
                hidden: true,
            },
        ],
    };

    return (
        <main className="flex h-screen">
            <div className="w-[50%]"></div>
            <div className="w-[50%]">
                <CodeBlock
                    fcnName={MyProblem.fcnName}
                    params={MyProblem.params}
                    testCases={MyProblem.testCases}
                ></CodeBlock>
            </div>
        </main>
    );
}
