import ReactMarkdown from "react-markdown";

export default function ProblemDescription({
    name,
    desc,
}: {
    name: string;
    desc: string;
}) {
    return (
        <>
            <div className="flex flex-col h-full p-2">
                <div className="flex flex-col h-full p-2 overflow-auto rounded-md bg-slate-300">
                    <div className="p-4 border-b border-slate-500">
                        <h1 className="text-2xl font-bold">{name}</h1>
                    </div>
                    <div className="p-4">
                        <ReactMarkdown className="prose">{desc}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </>
    );
}
