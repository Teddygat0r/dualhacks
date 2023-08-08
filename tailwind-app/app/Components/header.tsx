import dynamic from "next/dynamic";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
const Auth = dynamic(() => import("./login"), {
    ssr: false,
});
export default function Header() {
    return (
        <>
            <div className="flex flex-row flex-initial h-24 bg-gray-300">
                <div>
                    <a href="/">
                        <Image
                            height="80"
                            width="80"
                            alt="W logo"
                            src="/mlogo.png"
                        ></Image>
                    </a>
                </div>
                <div className="pl-5 my-auto mr-auto">
                    <a href="/" className="text-lg">
                        <b>ByTech</b>
                    </a>
                </div>
                <div className="pr-6 my-auto ml-auto text-base">
                    <Auth red="/classes"></Auth>
                </div>
            </div>
        </>
    );
}
