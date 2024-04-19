import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Member, Profile } from '@prisma/client'


interface UserAvatarProps {
    src?: Profile;
    imageUrl?: string;
    member?: Member;
    className?: string;
}

export default function MemberAvatar({ src, member, imageUrl }: UserAvatarProps) {

    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-3 mx-1'>
                <Avatar className='h-8 w-8'>
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                    <div className='flex items-center'>
                        <div className="text-sm font-medium text-gray-900 dark:text-zinc-200">{src?.name}</div>
                    </div>
                </div>

            </div>

        </div>
    )
}
