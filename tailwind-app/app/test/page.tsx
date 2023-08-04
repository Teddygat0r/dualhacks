import { Problem } from "@/Components/types";
import CodeBlock from "@/Components/CodeBlock";
import ProblemDescription from "@/Components/ProblemDescription";

export default function Page() {
    const MyProblem: Problem = {
        name: "Add Numbers",
        fcnName: "add_two_numbers",
        params: "num1, num2",
        description: ` 
You are given two non-empty numbers representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return it as a linked list.
        
You may assume the two numbers do not contain any leading zero, except the number 0 itself.
        
### Function Signature
        
\`\`\`python
def add_two_numbers(num1: int, num2: int) -> int:
    pass
\`\`\`
            
### Input
The function add_two_numbers takes two parameters:
l1: The head node of the first linked list representing the first number.
l2: The head node of the second linked list representing the second number.
### Output
The function should return the head node of a new linked list representing the sum of the two numbers.

### Example
\`\`\`
Input: l1 = 2 -> 4 -> 3, l2 = 5 -> 6 -> 4
Output: 7 -> 0 -> 8
Explanation: 342 + 465 = 807.
\`\`\`

### Constraints
It is guaranteed that the list represents a non-negative integer less than or equal to 10000.
`,
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
            <div className="w-[50%] bg-slate-500">
                <ProblemDescription
                    name={MyProblem.name}
                    desc={MyProblem.description}
                ></ProblemDescription>
            </div>
            <div className="w-[50%] bg-slate-500">
                <CodeBlock
                    fcnName={MyProblem.fcnName}
                    params={MyProblem.params}
                    testCases={MyProblem.testCases}
                ></CodeBlock>
            </div>
        </main>
    );
}
