import Image from "next/image";
import dynamic from "next/dynamic";
const Auth = dynamic(() => import("./login"), {
    ssr: false,
});

export default function Header() {
    return (
        <>
            <div className="flex flex-row flex-initial flex-grow-0 h-16">
                <div>
                    <Image
                        height="100"
                        width="100"
                        alt="no logo joever"
                        src="/logo.PNG"
                    ></Image>
                </div>
                <div className="ml-auto">{<Auth red="/classes"></Auth>}</div>
            </div>
        </>
    );
}
