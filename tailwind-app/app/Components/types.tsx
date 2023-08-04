export type InputOutput = {
    input: any[];
    output: any[];
};

export type TestCase = {
    input: string;
    output: string;
    hidden: boolean;
};

export type Problem = {
    name: string;
    fcnName: string;
    params: string;
    description: string;
    testCases: TestCase[];
};
