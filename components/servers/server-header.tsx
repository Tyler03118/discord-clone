'use client'
import { ServerWithMembersWithProfiles } from '@/types'
import { MemberRole } from '@prisma/client';
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';
import { useModalStore } from '@/hooks/use-modal-store';

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {

    const isAdmin = role === 'ADMIN';
    const isModerator = isAdmin || role === 'MODERATOR';

    const { openModal } = useModalStore();


    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className='w-full text-md font-semibold px-5 flex items-center h-12 border-neutral-200 dark:border-zinc-700 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition justify-between'>
                        {server.name}
                        <ChevronDown className='w-4 h-4' />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    {isModerator && (
                        <DropdownMenuItem onClick={() => openModal('invite', { server: server })} className='text-purple-400 dark:text-purple-300 cursor-pointer'>Invite People
                            <UserPlus className='w-4 h-4 ml-auto' />
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem className='dark:text-zinc-300 cursor-pointer'
                            onClick={() => openModal('serverSetting', { server: server })}>
                            Server Settings
                            <Settings className='w-4 h-4 ml-auto' />
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (<DropdownMenuItem className='dark:text-zinc-300 cursor-pointer'
                        onClick={() => openModal('manageMembers', { server: server })}>
                        Manage Memebers
                        <Users className='w-4 h-4 ml-auto' />
                    </DropdownMenuItem>)}
                    {isModerator && (<DropdownMenuItem className='dark:text-zinc-300 cursor-pointer'
                        onClick={() => openModal('createChannel')}>
                        Create Channel
                        <PlusCircle className='w-4 h-4 ml-auto' />
                    </DropdownMenuItem>)}
                    {isModerator && <DropdownMenuSeparator />}
                    {isAdmin && (
                        <DropdownMenuItem className='text-red-500 cursor-pointer'
                            onClick={() => openModal('deleteServer', { server: server })}>
                            Delete Server
                            <Trash className='w-4 h-4 ml-auto' />
                        </DropdownMenuItem>)}
                    {!isAdmin && (<DropdownMenuItem className='dark:text-zinc-300 cursor-pointer'
                        onClick={() => openModal('leaveServer', { server: server })}>
                        Leave Server
                        <LogOut className='w-4 h-4 ml-auto' />
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}
