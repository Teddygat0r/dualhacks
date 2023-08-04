import Logo from "./Components/logo";
import Image from "next/image";
export default function Home() {
    return (
        <>
            <main className="flex flex-initial flex-col min-h-screen p-24">
                <div className="flex flex-col md:flex-row">
                    <div className="w-1/2">
                        <h1>
                            <b className="text-[60px]">
                                Help I dont know what im doing
                            </b>
                        </h1>
                        <div className="text-xl">
                            also some more text here?
                            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa
                        </div>
                    </div>
                    <div className="w-1/2 aspect-square text-right">
                        <Image
                            height="200"
                            width="200"
                            alt="no logo joever"
                            src="/demoimage.jpg"
                        ></Image>
                    </div>
                </div>
            </main>
        </>
    );
}
