import Header from "./Components/header";
import Image from "next/image";

export default function Home() {
    // joshua probably isn't going to look at the code that means i can say he's bald and he won't know
    return (
        <>
            <main className="flex flex-col flex-initial min-h-screen p-24">
                <div className="flex flex-col md:flex-row">
                    <div className="w-1/2">
                        <h1>
                            <b className="text-[34px]">
                                Empowering Education with AI-Assisted Learning Management
                            </b>
                        </h1>
                        <div className="text-xl">
                            Introducing LearnMentor Connect, the revolutionary
                            educational tool that combines the power of AI with
                            traditional teaching methods. Designed to enhance
                            the teaching and learning experience, LearnMentor
                            Connect brings together educators, students, and
                            Language Models (LLMs) in an innovative platform.
                            Seamlessly integrated with familiar features of
                            learning management systems, LearnMentor Connect
                            offers personalized assignment creation assistance
                            for teachers and comprehensive assignment
                            explanations for students.
                        </div>
                        <div>
                            <a
                                href="/auth"
                                className="inline-block px-8 py-4 mt-4 text-right text-blue-500 text-[36px] transition border-blue-500 border-[3px] duration-300 rounded-lg hover:text-white hover:bg-blue-600"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                    <div className="w-1/2 text-right">
                        <Image
                            height="600"
                            width="600"
                            alt="no logo joever"
                            src="/DemoImage.png"
                            className="w-full"
                        ></Image>
                    </div>
                </div>

            </main>
        </>
    );
}
