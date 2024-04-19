import { ChannelType } from '@prisma/client';
import { Hash, Menu, Mic, Video } from 'lucide-react';
import React from 'react'
import MobileToggle from '../mobile-toggle';
import Image from 'next/image';
import MemberAvatar from '../memberAvatar';
import { SocketIndicator } from '../ui/socket-indicator';
import { ChatVideoButton } from './chat-video-button';

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: ChannelType | 'conversation';
    imageUrl?: string;
}

export default function ChatHeader({ serverId, name, type, imageUrl }: ChatHeaderProps) {


    return (
        <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
            <div className='flex items-center gap-x-2'>
                <button className='md:hidden'>
                    <MobileToggle serverId={serverId} />
                </button>
                {type === ChannelType.TEXT && <Hash className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />}
                {type === ChannelType.AUDIO && <Mic className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />}
                {type === ChannelType.VIDEO && <Video className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />}
                {type === 'conversation' && (
                    <MemberAvatar imageUrl={imageUrl} />
                )}
                {name}

            </div>
            <div className='ml-auto flex items-center'>
                {type === "conversation" && (
                    <ChatVideoButton />
                )}
                <SocketIndicator />
            </div>
        </div>
    )
}
