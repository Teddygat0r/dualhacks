"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { doc, addDoc, collection } from "firebase/firestore";
import { MyClass, TestCase } from "@/app/Components/types";
import classConverter from "@/app/_utils/ClassConverter";
import { useEffect, useState, useRef } from "react";
import { redirect } from "next/navigation";
import ProblemDescription from "@/app/Components/ProblemDescription";
import { PythonProvider, usePython } from "react-py";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { ChatGPTAPI } from "chatgpt";
import Child from "./child";
import assignmentConverter from "@/app/_utils/AssignmentConverter";

interface TestCaseOutput {
    input: string;
    output: string;
    stdout: string;
    stderr: string;
}

export default function Page({ params }: { params: { class_slug: string } }) {
    const [user, userLoading] = useAuthState(auth);
    const [snapshot, classLoading] = useDocumentDataOnce<MyClass>(
        doc(firestore, "class", params.class_slug).withConverter(
            classConverter,
        ),
    );

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [fcnName, setFcnName] = useState("");
    const [code, setCode] = useState("");
    const [due, setDue] = useState(0);
    const [input, setInput] = useState("");
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [passed, setPassed] = useState(0);
    const prompt = `Create one test case(input only) for the following problem. Only return the test case, with nothing before or after. The problem starts after the dotted line. If there are two or more inputs required, return each of them separated by a comma. Surround each string with double quotes.\n --------------------------------------------------------\n`;
    const [newCase, setNewCase] = useState("");
    const [results, setResults] = useState<TestCaseOutput[]>([]);

    const {
        runPython,
        stdout,
        stderr,
        isLoading,
        isRunning,
        interruptExecution,
    } = usePython();

    const runningRef = useRef(false);
    const stdoutRef = useRef("");
    const stderrRef = useRef("");
    const api = new ChatGPTAPI({
        apiKey: "", // put something here later
        completionParams: {
            model: "gpt-3.5-turbo",
            temperature: 0.1,
        },
    });
    runningRef.current = isRunning;
    stdoutRef.current = stdout;
    stderrRef.current = stderr;

    const [renderText, setRenderText] = useState(false);

    useEffect(() => {
        if (!userLoading && !classLoading) {
            if (!user || !snapshot) {
                redirect("/");
            }
            if (user.uid !== snapshot.teacher.id) {
                redirect("/");
            }
        }
    }, [user, userLoading, snapshot, classLoading]);

    const queryGPT = async (question: string) => {
        const returnCase = await api.sendMessage(`${prompt}${question}`);
        return returnCase.text;
    };

    const inputs = () => {
        return (
            <>
                <div>
                    <label className="text-white">Enter Name:</label>
                    <br />
                    <input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        className="w-full px-3 py-1 m-auto text-black border border-black rounded-md"
                    />
                </div>
                <div>
                    <label className="text-white">Enter Due Date:</label>
                    <br />
                    <input
                        type="date"
                        onChange={(e) => {
                            setDue(e.target.valueAsNumber);
                        }}
                        className="w-full px-3 py-1 m-auto text-black border border-black rounded-md"
                    />
                </div>
                <div>
                    <label className="text-white">Enter Function Name:</label>
                    <br />
                    <input
                        value={fcnName}
                        onChange={(e) => {
                            setFcnName(e.target.value);
                        }}
                        className="w-full px-3 py-1 m-auto text-black border border-black rounded-md"
                    />
                </div>
                <div>
                    <label className="text-white">
                        Enter Function Parameters:
                    </label>
                    <br />
                    <input
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                        }}
                        className="w-full px-3 py-1 m-auto text-black border border-black rounded-md"
                    />
                </div>
                <div className="flex flex-col gap-0 grow">
                    <label className="text-white">
                        Enter Problem Description (Markdown)
                    </label>
                    <textarea
                        value={desc}
                        onChange={(e) => {
                            setDesc(e.target.value);
                        }}
                        className="w-full px-3 py-1 m-auto text-black border border-black rounded-md grow"
                    />
                </div>
            </>
        );
    };

    const getPassFcn = () => {
        if (passed === 3) {
            return <span className="text-green-600">Passed</span>;
        } else if (passed === 2) {
            return <span className="text-red-600">Time Limit Exceeded</span>;
        } else if (passed === 1) {
            return <span className="text-red-600">Incorrect Answer</span>;
        } else if (passed === 0) {
            return <span className="font-thin text-slate-700">Not Passed</span>;
        }
    };

    const modifyTestCases = (index: number, item: TestCase) => {
        testCases[index] = item;
    };
    const onDelete = (index: number, item: TestCase) => {
        var tempValue = [...testCases];
        tempValue.splice(index, 1);
        setTestCases(tempValue);
    };

    function runSingleCase(input: string) {
        return new Promise((resolve) => {
            const checkInterval = 100;
            const maxWaitTime = 2000;
            const fullCode = `${code}
print(${fcnName}(${input}))
`;
            runPython(fullCode);

            let elapsedTime = 0;
            const intervalId = setInterval(() => {
                if (!runningRef.current) {
                    clearInterval(intervalId);
                    resolve(true);
                } else {
                    elapsedTime += checkInterval;
                    if (elapsedTime >= maxWaitTime) {
                        console.log("interrupted");
                        interruptExecution();
                        clearInterval(intervalId);
                        resolve(false);
                    }
                }
            }, checkInterval);
        });
    }

    const submitPython = async () => {
        let visCaseResults: TestCaseOutput[] = testCases.map((item) => {
            return {
                input: item.input,
                output: item.output,
                stdout: "",
                stderr: "",
            };
        });
        let visCounter = 0;
        let haspassed = 3;
        for (let i = 0; i < testCases.length; i++) {
            const res = await runSingleCase(testCases[i].input);

            visCaseResults[visCounter].stdout = stdoutRef.current.trim();
            visCaseResults[visCounter].stderr = stderrRef.current.trim();
            if (res === false) {
                visCaseResults[visCounter].stderr +=
                    "\nTLE (Time Limit Exceeded).";
                haspassed = 2;
                break;
            }
            visCounter++;

            if (res && stderrRef.current.trim() !== "") {
                haspassed = 1;
                break;
            }
        }
        setPassed(haspassed);
        setResults(visCaseResults);
    };

    useEffect(() => {
        console.log(results);
    }, [results]);

    const saveResults = () => {
        if (name === "") {
            alert("Name is Empty");
            return;
        }
        if (desc === "") {
            alert("Description is Empty");
            return;
        }
        if (fcnName === "") {
            alert("fcnName is Empty");
            return;
        }
        if (due === 0) {
            alert("Due Date is Empty");
            return;
        }
        if (due <= Date.now()) {
            alert("Due Date is in the past.");
            return;
        }
        if (testCases.length === 0) {
            alert("No test Cases");
            return;
        }
        if (passed !== 3) {
            alert("Not All Cases passed.");
            return;
        }

        const finalCases = [...testCases];
        finalCases.forEach((item: TestCase, index) => {
            item.output = results[index].stdout;
        });

        (async () => {
            await addDoc(
                collection(
                    firestore,
                    `class/${params.class_slug}/assignment`,
                ).withConverter(assignmentConverter),
                {
                    name: name,
                    description: desc,
                    due: new Date(due),
                    fcnName: fcnName,
                    params: input,
                    testCases: finalCases,
                    id: "",
                },
            );
        })();
        redirect(`/class/${params.class_slug}`);
    };

    return (
        <main className="flex max-h-[calc(100vh-64px)] grow">
            <div className="w-[50%] bg-slate-500 flex flex-col py-8 px-16 gap-4">
                {renderText ? (
                    <div className="h-[92%]">
                        <ProblemDescription
                            name={name}
                            desc={desc}
                        ></ProblemDescription>
                    </div>
                ) : (
                    inputs()
                )}
                <div className="flex w-full">
                    <button
                        className={`px-4 py-2 ml-auto duration-150 border rounded-lg border-slate-700 ${
                            renderText
                                ? "bg-red-400 hover:bg-red-500"
                                : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                        onClick={() => {
                            setRenderText(!renderText);
                        }}
                    >
                        {renderText ? "Unrender" : "Render"}
                    </button>
                </div>
            </div>
            <div className="w-[50%] bg-slate-500">
                <PythonProvider>
                    <div className="flex flex-col w-full h-full text-slate-700">
                        <div className="flex flex-col px-3 py-2 h-[50%]">
                            <CodeMirror
                                value={code}
                                extensions={[python()]}
                                onChange={(e) => {
                                    setCode(e);
                                }}
                                minHeight="450px"
                                className="overflow-y-scroll rounded-md"
                            />
                        </div>
                        <div className="flex flex-col flex-grow px-3 py-2 overflow-y-scroll h-[50%]">
                            <div className="flex justify-between p-4 my-auto font-bold bg-slate-300 rounded-t-md">
                                <p className="my-auto text-center">
                                    Function: {fcnName}({input})
                                </p>
                                <div className="flex gap-3">
                                    <p className="my-auto text-sm">
                                        {getPassFcn()}
                                    </p>
                                    <button
                                        disabled={isLoading || isRunning}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            submitPython();
                                        }}
                                        className="px-4 py-2 duration-150 bg-green-400 rounded-md hover:bg-green-500"
                                    >
                                        {isLoading || isRunning ? (
                                            <p>Loading...</p>
                                        ) : (
                                            <p>Test Cases</p>
                                        )}
                                    </button>
                                    <button
                                        disabled={isLoading || isRunning}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            saveResults();
                                        }}
                                        className="px-4 py-2 text-black duration-150 bg-red-400 rounded-md hover:bg-red-500"
                                    >
                                        Save Results
                                    </button>
                                </div>
                            </div>
                            <div className="flex-grow p-4 border-t rounded-b-md bg-slate-300 border-slate-500">
                                {testCases.map((item: TestCase, index) => (
                                    <Child
                                        key={index}
                                        index={index}
                                        it={item}
                                        onChange={modifyTestCases}
                                        onDelete={onDelete}
                                    />
                                ))}
                                <div className="flex flex-col mt-2">
                                    <label>Enter New Test Case:</label>
                                    <div className="flex gap-4">
                                        <input
                                            className="px-3 py-1 my-1 rounded-md grow"
                                            value={newCase}
                                            onChange={(e) => {
                                                setNewCase(e.target.value);
                                            }}
                                        />
                                        <button
                                            className="px-3 py-1 duration-150 bg-blue-300 border rounded-md border-slate-700 hover:bg-blue-400"
                                            onClick={() => {
                                                setTestCases([
                                                    ...testCases,
                                                    {
                                                        input: newCase,
                                                        output: "",
                                                        hidden: false,
                                                    },
                                                ]);
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </PythonProvider>
            </div>
            {/* {assignment && submission ? (
                <>
                    <div className="w-[50%] bg-slate-500">
                        <ProblemDescription
                            name={assignment.name}
                            desc={assignment.description}
                        ></ProblemDescription>
                    </div>
                    <div className="w-[50%] bg-slate-500">
                        <CodeBlock
                            fcnName={assignment.fcnName}
                            params={assignment.params}
                            testCases={assignment.testCases}
                            submission={submission}
                            baseUrl={`class/${params.class_slug}/assignment/${params.assignment_slug}/submission`}
                        ></CodeBlock>
                    </div>
                </>
            ) : (
                <div>hi</div>
            )} */}
        </main>
    );
}
