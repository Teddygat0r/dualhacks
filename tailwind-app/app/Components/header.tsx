import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import Auth from "./login";
export default function Header() {
    return (
        <>
            <title>
                LearnMentor Connect
            </title>
            <div className="flex flex-row flex-initial h-16 bg-green-500">
                <div>
                    <a href="/">
                        <Image
                            height="67"
                            width="67"
                            alt="no logo joever"
                            src="/logo.PNG"
                        ></Image>
                    </a>
                </div>
                <div className="pl-5 my-auto mr-auto">
                    <a  href="/"
                        className="text-[25px]"
                    >
                       <b>LearnMentor Connect</b>
                    </a>
                </div>
                <div className="pr-5 my-auto ml-auto">
                   <Auth red="/classes"></Auth>
                </div>
            </div>
        </>
    );
}
