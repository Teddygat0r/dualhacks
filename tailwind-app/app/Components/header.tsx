import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import Auth from "./login";
export default function Header() {
    return (
        <>
            <div className="flex flex-row flex-initial h-16">
                <div>
                    <Image
                        height="100"
                        width="100"
                        alt="no logo joever"
                        src="/logo.PNG"
                    ></Image>
                </div>
                <div className="ml-auto">
                   <Auth red="/classes"></Auth>
                </div>
            </div>
        </>
    );
}