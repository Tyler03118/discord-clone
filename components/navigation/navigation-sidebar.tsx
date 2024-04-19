import { currentProfile } from '@/lib/current-profile'
import { redirect } from 'next/navigation';
import React from 'react'
import db from '@/lib/db';
import { Separator } from "@/components/ui/separator"
import NavigationItem from './navigation-item';
import { ScrollArea } from '../ui/scroll-area';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';
import NavigationAction from './navigation-action';


export const NavigationSidebar = async () => {

    const profile = await currentProfile();

    if (!profile) {
        return redirect('/');
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return (
        <div className="space-y-4 flex flex-col items-center 
        h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E3E8] py-3"
        >
            {/* {点击按钮创建新的服务器} */}
            <NavigationAction />
            <Separator className='bg-zinc-700 mx-4 w-10 h-0.5' />
            <ScrollArea className='flex-1 w-full'>
                {servers.map((server) => (
                    <div key={server.id} className='py-2'>
                        <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
                    </div>
                ))}
            </ScrollArea>
            <div className='pb-3 flex flex-col mt-auto items-center gap-y-4'>
                <ModeToggle />
                <UserButton afterSignOutUrl='/' appearance={{ elements: { avatarBox: "h-[48px] w-[48px]" } }} />
            </div>
        </div>
    )
}
