import { MyClass } from "./types";
import Link from "next/link";
import Image from "next/image";

interface ClassProps extends MyClass {
    classUrl: string;
}

export default function Class({
    code,
    desc,
    name,
    students,
    teacher,
    id,
}: ClassProps) {
    return (
        <div>
            <div className="relative flex w-full py-6 border border-black rounded-lg">
                <Image
                    src="/stacked_waves.svg"
                    alt=""
                    className="absolute top-0 object-cover w-full h-full rounded-lg"
                    width="600"
                    height="400"
                />
                <h1 className="z-10 m-auto text-4xl font-semibold text-center text-white mx-10">
                    {name}
                </h1>
            </div>
            <div className="relative flex gap-16">
                <div className="w-full">
                    <div className="p-4 border border-opacity-50 rounded-lg border-slate-400">
                        <h1 className="mb-2 text-sm font-bold">About:</h1>
                        <p>{desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
