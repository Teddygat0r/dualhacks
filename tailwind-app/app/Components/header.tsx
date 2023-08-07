import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import Auth from "./login";
export default function Header() {
    return (
        <>
            <title>
                LearnMentor Connect
            </title>
            <div className="flex flex-row flex-initial h-24">
                <div>
                    <a href="/">
                        <Image
                            height="80"
                            width="80"
                            alt="W logo"
                            src="/WebsiteLogo.png"
                        ></Image>
                    </a>
                </div>
                <div className="pl-5 my-auto mr-auto">
                    <a  href="/"
                        className="text-[40px]"
                    >
                       <b>LearnMentor Connect</b>
                    </a>
                </div>
                <div className="pr-6 my-auto ml-auto text-[30px]">
                   <Auth red="/classes"></Auth>
                </div>
            </div>
        </>
    );
}
