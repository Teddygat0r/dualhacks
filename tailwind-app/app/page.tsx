import Logo from "./Components/logo";
import DemoImage from "./Components/demoimage";
export default function Home() {
    return (
        <>
            <main className="flex flex-initial flex-col min-h-screen p-24 ">
                <header className="w-full">
                    <div>
                        <Logo></Logo>
                    </div>
                </header>
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
                        <DemoImage></DemoImage>
                    </div>
                </div>
            </main>
        </>
    );
}
    