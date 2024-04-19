import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Gavel, MoreVertical, RotateCcw, RotateCw, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { Member, Profile } from '@prisma/client'
import { useState } from 'react';
import qs from 'query-string';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';


interface UserAvatarProps {
    src?: Profile;
    member?: Member;
    className?: string;
}

export default function UserAvatar({ src, member }: UserAvatarProps) {

    const isAdmin = member?.role === 'ADMIN';
    const isModerator = isAdmin || member?.role === 'MODERATOR';
    const [loadingId, setLoadingId] = useState("");

    const router = useRouter();

    const { openModal } = useModalStore();


    const updateRole = async (role: Member['role']) => {
        try {
            setLoadingId(member.id);
            const url = qs.stringifyUrl({
                url: `/api/members/${member.id}`,
                query: {
                    serverId: member.serverId
                }
            });

            const response = await axios.patch(url, { role });

            router.refresh();
            openModal('manageMembers', { server: response.data });
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId("");
        }
    }

    const onKick = async () => {
        try {
            setLoadingId(member.id);
            const url = qs.stringifyUrl({
                url: `/api/members/${member.id}`,
                query: {
                    serverId: member.serverId
                }
            });

            await axios.delete(url);
            router.refresh();
            openModal('manageMembers', { server: response.data });
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId("");
        }
    }

    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-5 pt-3 mx-1'>
                <Avatar>
                    <AvatarImage src={src?.imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className='flex flex-col'>
                    <div className='flex items-center'>
                        <div className="text-sm font-medium text-gray-900 dark:text-zinc-200">{src?.name}</div>
                        {!isModerator && <Shield className='w-4 h-4 text-gray-500 ml-1' />}
                        {isAdmin && <ShieldCheck className='w-4 h-4 text-green-500 ml-1' />}
                        {isModerator && !isAdmin && <ShieldAlert className='w-4 h-4 text-indigo-500 ml-1' />}
                    </div>
                    <div className="text-sm text-gray-500">{src?.email}</div>
                </div>
            </div>
            <div>
                <button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                {loadingId === member?.id ? <RotateCw className='w-4 h-4 animate-spin' /> : <MoreVertical className='w-4 h-4' />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='left' align="end">
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <ShieldQuestion className='w-4 h-4 mr-2' />
                                    Role
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => updateRole('GUEST')}>
                                                <Shield className='w-4 h-4 mr-2' />
                                                Guest
                                                {!isModerator && <Check className='w-4 h-4 ml-auto' />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { updateRole('MODERATOR') }}>
                                                <ShieldAlert className='w-4 h-4 mr-2' />
                                                Moderator
                                                {isModerator && !isAdmin && <Check className='w-4 h-4 ml-auto' />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { updateRole('ADMIN') }}>
                                                <ShieldCheck className='w-4 h-4 mr-2' />
                                                Admin
                                                {isAdmin && <Check className='w-4 h-4 ml-auto' />}
                                            </DropdownMenuItem>

                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSubTrigger>
                            </DropdownMenuSub>
                            <DropdownMenuItem onClick={() => { onKick() }}>
                                <Gavel className='w-4 h-4 mr-2' />
                                Kick
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                </button>
            </div>
        </div>
    )
}
