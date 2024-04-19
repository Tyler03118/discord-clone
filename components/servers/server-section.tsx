'use client'
import { ServerWithMembersWithProfiles } from '@/types';
import { ChannelType, MemberRole } from '@prisma/client';
import React from 'react'
import { ActionTooltip } from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModalStore } from '@/hooks/use-modal-store';

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

export default function ServerSection({
    label,
    role,
    sectionType,
    channelType,
    server
}: ServerSectionProps) {

    const { openModal } = useModalStore();
    return (
        <div className='flex items-center justify-between px-5 py-2'>
            <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === 'channels' && (
                <ActionTooltip label='Create Channel' side='top'>
                    <button onClick={() => openModal('createChannel', { channelType: channelType })} className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'>
                        <Plus className='h-4 w-4' />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === 'members' && (
                <ActionTooltip label='Manage Members' side='top'>
                    <button onClick={() => openModal('manageMembers', { server: server })} className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'>
                        <Settings className='h-4 w-4' />
                    </button>
                </ActionTooltip>
            )}
        </div>
    )
};
function useModal(): { onOpen: any; } {
    throw new Error('Function not implemented.');
}

