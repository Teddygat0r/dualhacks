import Header from "./Components/header";
import Image from "next/image";

export default function Home() {
    // joshua probably isn't going to look at the code that means i can say he's bald and he won't know
    return (
        <>
            <main className="flex flex-col flex-initial p-24">
                <div className="flex flex-col md:flex-row">
                    <div className="w-1/2">
                        <h1>
                            <b className="text-[60px]">
                                Empowering Coding Education with AI
                            </b>
                        </h1>
                        <div className="mt-4 text-xl">
                            Introducing ByTech, the revolutionary educational
                            tool that combines the power of AI with traditional
                            teaching methods. Seamlessly integrated with
                            familiar features of learning management systems,
                            ByTech offers personalized assignment creation
                            assistance for teachers and comprehensive assignment
                            explanations for students.
                        </div>
                        <div>
                            <a
                                href="/classes"
                                className="inline-block px-4 py-2 mt-4 text-right text-white transition duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                    <div className="w-1/2 text-right">
                        <Image
                            height="1280"
                            width="9999"
                            alt="no logo joever"
                            src="/banner.png"
                            className="w-full"
                        ></Image>
                    </div>
                </div>
            </main>
        </>
    );
}
