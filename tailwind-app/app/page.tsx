import Logo from "./Components/logo";
import Image from "next/image";
export default function Home() {
    return (
        <>
            <main className="flex flex-col flex-initial min-h-screen p-24">
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
                    <div className="w-1/2 text-right">
                        <Image
                            height="400"
                            width="400"
                            alt="no logo joever"
                            src="/demoimage.jpg"
                            className="w-full"
                        ></Image>
                    </div>
                </div>
            </main>
        </>
    );
}
