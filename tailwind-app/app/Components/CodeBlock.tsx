"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { ViewUpdate } from "@codemirror/view";
import { useState, useRef } from "react";
import { usePython, PythonProvider } from "react-py";
import { TestCase } from "@/app/Components/types";

interface TestCaseOutput {
    input: string;
    output: string;
    stdout: string;
    stderr: string;
}

export default function CodeBlock({
    fcnName,
    params,
    testCases,
}: {
    fcnName: string;
    params: string;
    testCases: TestCase[];
}) {
    const [code, setCode] = useState(`def ${fcnName}(${params}):\n\n\n`);
    const [showCases, setShowCases] = useState(
        testCases
            .filter((item) => !item.hidden)
            .map((item) => {
                return {
                    input: item.input,
                    output: item.output,
                    stdout: "",
                    stderr: "",
                };
            }),
    );

    const {
        runPython,
        stdout,
        stderr,
        isLoading,
        isRunning,
        interruptExecution,
    } = usePython();

    const [selectedCase, setSelectedCase] = useState(0);
    const [passed, setPassed] = useState(0);

    const runningRef = useRef(false);
    const stdoutRef = useRef("");
    const stderrRef = useRef("");
    runningRef.current = isRunning;
    stdoutRef.current = stdout;
    stderrRef.current = stderr;

    const onChange = React.useCallback(
        (value: string, viewUpdate: ViewUpdate) => {
            setCode(value);
        },
        [],
    );

    const handleSelectCase = (index: number) => {
        setSelectedCase(index);
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
        let visCaseResults: TestCaseOutput[] = testCases
            .filter((item) => !item.hidden)
            .map((item) => {
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

            if (testCases[i].hidden === false) {
                visCaseResults[visCounter].stdout = stdoutRef.current.trim();
                visCaseResults[visCounter].stderr = stderrRef.current.trim();
                if (res === false) {
                    visCaseResults[visCounter].stderr +=
                        "\nTLE (Time Limit Exceeded).";
                    setSelectedCase(visCounter);
                    haspassed = 2;
                    break;
                }
                if (stdoutRef.current.trim() !== testCases[i].output) {
                    setSelectedCase(visCounter);
                    haspassed = 1;
                    break;
                }
                visCounter++;
            } else {
                if (res === false) {
                    haspassed = 2;
                    break;
                } else if (stdoutRef.current.trim() !== testCases[i].output) {
                    haspassed = 1;
                    break;
                }
            }
        }
        setPassed(haspassed);
        setShowCases(visCaseResults);
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

    return (
        <PythonProvider>
            <div className="flex flex-col w-full h-full text-slate-700">
                <div className="flex flex-col px-3 py-2 h-[50%]">
                    <CodeMirror
                        value={code}
                        extensions={[python()]}
                        onChange={onChange}
                        minHeight="450px"
                        className="overflow-y-scroll rounded-md"
                    />
                </div>

                <div className="flex flex-col flex-grow px-3 py-2 overflow-y-scroll h-[50%]">
                    <div className="flex justify-between p-4 my-auto font-bold bg-slate-300 rounded-t-md ">
                        <p className="my-auto text-center">
                            Function: {fcnName}({params})
                        </p>
                        <div className="flex gap-3">
                            <p className="my-auto text-sm">{getPassFcn()}</p>
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
                        </div>
                    </div>
                    <div className="flex-grow border-t rounded-b-md bg-slate-300 border-slate-500">
                        <div className="flex gap-4 m-4">
                            {showCases.map((item, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1  rounded-md  border-slate-700 ${
                                        index === selectedCase
                                            ? "bg-slate-500 text-white"
                                            : "bg-slate-300 border hover:bg-slate-400 duration-150"
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSelectCase(index);
                                    }}
                                >
                                    Case {index + 1}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 px-4">
                            <div className="flex flex-col gap-1">
                                <p>Input: </p>
                                <code className="px-2 py-1 break-words rounded-md bg-slate-600 text-slate-300">
                                    {showCases[selectedCase].input}
                                </code>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p>Expected Output: </p>
                                <code className="px-2 py-1 break-words rounded-md bg-slate-600 text-slate-300">
                                    {showCases[selectedCase].output}
                                </code>
                            </div>
                            {showCases[selectedCase].stdout != "" ||
                            showCases[selectedCase].stderr != "" ? (
                                <div className="flex flex-col gap-1">
                                    <p>Your Output: </p>
                                    <code className="px-2 py-1 break-words rounded-md text-slate-300 bg-slate-600">
                                        {showCases[selectedCase].stdout !=
                                        "" ? (
                                            <>
                                                <span>
                                                    {
                                                        showCases[selectedCase]
                                                            .stdout
                                                    }
                                                </span>
                                                <br />
                                            </>
                                        ) : (
                                            <></>
                                        )}

                                        {showCases[selectedCase].stderr !=
                                        "" ? (
                                            <span className="text-red-500">
                                                {showCases[selectedCase].stderr}
                                            </span>
                                        ) : (
                                            <></>
                                        )}
                                    </code>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PythonProvider>
    );
}
