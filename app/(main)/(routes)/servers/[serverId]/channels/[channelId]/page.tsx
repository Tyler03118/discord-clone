import ChatHeader from '@/components/channels/chat-header';
import ChatInput from '@/components/channels/chat-input';
import ChatMessages from '@/components/channels/chat-messages';
import MediaRoom from '@/components/media-room';
import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import React from 'react'

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {

    const profile = await currentProfile();

    if (!profile) {
        return redirect('/login');
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        }
    });

    const member = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId: params.serverId
        }
    });

    if (!channel || !member) {
        return new NextResponse("Something going woring with channel or member info", { status: 404 });
    }


    return (
        <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
            <ChatHeader serverId={params.serverId} name={channel.name} type={channel.type} />
            {channel.type === ChannelType.TEXT && (<>
                <ChatMessages
                    member={member}
                    name={channel.name}
                    chatId={channel.id}
                    type="channel"
                    apiUrl='/api/messages'
                    socketUrl='/api/socket/messages'
                    socketQuery={{
                        channelId: channel.id,
                        serverId: channel.serverId
                    }}
                    paramKey="channelId"
                    paramValue={channel.id}
                />
                <ChatInput name={channel.name} type="channel" apiUrl='/api/socket/messages'
                    query={{
                        channelId: channel.id,
                        serverId: channel.serverId
                    }} />
            </>)}

            {channel.type === ChannelType.AUDIO && (
                <MediaRoom
                    chatId={channel.id}
                    video={false}
                    audio={true}
                />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom
                    chatId={channel.id}
                    video={true}
                    audio={true}
                />
            )}

        </div>
    )
}
