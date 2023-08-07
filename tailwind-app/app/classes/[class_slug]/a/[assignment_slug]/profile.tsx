import { User } from "@/app/Components/types";
import Image from "next/image";

export default function Profile({ user }: { user: User }) {
    return (
        <>
            <div className="flex w-full duration-150 hover:bg-slate-400">
                <div className="p-2 border-r border-slate-500">
                    <Image
                        src={user.profile_picture}
                        width="48"
                        height="48"
                        alt={user.username}
                        className="rounded-full"
                    />
                </div>
                <div className="m-auto ml-2 text-semibold">
                    <h1 className="m-auto">{user.username}</h1>
                </div>
            </div>
        </>
    );
}
