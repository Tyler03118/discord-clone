'use client'

import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile, Server } from '@prisma/client'
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import MemberAvatar from '../memberAvatar';

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server;
}

const roleMap = {
    [MemberRole.GUEST]: <Shield className='w-4 h-4 mr-2 text-gray-500' />,
    [MemberRole.MODERATOR]: <ShieldAlert className='w-4 h-4 mr-2 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldCheck className='w-4 h-4 mr-2 text-green-500' />,
}

export default function ServerMember({ member, server }: ServerMemberProps) {

    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${server.id}/conversations/${member.id}`);
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-6 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
            )}>
            <MemberAvatar imageUrl={member.profile.imageUrl} src={member.profile} />
            <p className={
                cn(
                    "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.memberId === member.id && 'text-primary dark:text-zinc-200 dark:hover:text-white'
                )
            }></p>
        </button>
    )
}
