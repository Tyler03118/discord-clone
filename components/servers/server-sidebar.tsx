import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import React from 'react'
import ServerHeader from './server-header';
import { redirect } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './server-search';
import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, Shield, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { Separator } from '../ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

interface ServerSidebarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className='w-4 h-4 mr-2' />,
    [ChannelType.AUDIO]: <Mic className='w-4 h-4 mr-2' />,
    [ChannelType.VIDEO]: <Video className='w-4 h-4 mr-2' />,
}

const roleMap = {
    [MemberRole.GUEST]: <Shield className='w-4 h-4 mr-2 text-gray-500' />,
    [MemberRole.MODERATOR]: <ShieldAlert className='w-4 h-4 mr-2 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldCheck className='w-4 h-4 mr-2 text-green-500' />,
}

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        // get server include channeles, members and its profile
        where: {
            id: serverId,
        },
        include: {
            channels: true,
            members: {
                include: {
                    profile: true
                }
            }
        }
    });

    if (!server) {
        return redirect('/');
    }

    const textChannels = server.channels.filter(channel => channel.type === 'TEXT');
    const audioChannels = server.channels.filter(channel => channel.type === 'AUDIO');
    const videoChannels = server.channels.filter(channel => channel.type === 'VIDEO');

    const member = server.members.find(member => member.profileId !== profile.id);

    const role = member?.role;

    return (
        <div className='h-full bg-neutral-100 dark:bg-zinc-800'>
            <ServerHeader server={server} role={role} />
            <ScrollArea>
                <div className='mt-2'>
                    <ServerSearch
                        data={[
                            {
                                label: 'Text Channels',
                                type: 'channel',
                                data: textChannels.map(channel => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id
                                }))
                            },
                            {
                                label: 'Audio Channels',
                                type: 'channel',
                                data: audioChannels.map(channel => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id
                                }))
                            },
                            {
                                label: 'Video Channels',
                                type: 'channel',
                                data: videoChannels.map(channel => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id
                                }))
                            },
                            {
                                label: 'Members',
                                type: 'member',
                                data: server.members.map(member => ({
                                    icon: roleMap[member.role],
                                    name: member.profile.name,
                                    id: member.profile.id
                                }))
                            }
                        ]}
                    />
                </div>
                <Separator className='bg-zinc-300 dark:bg-zinc-700 rounded-md my-2' />
                {!!textChannels?.length &&
                    <div className='mb-2'>
                        {/* Channel headbar */}
                        <ServerSection
                            sectionType='channels'
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                        />
                        <div className='space-y-[2px]'>
                            {/* Channel content */}
                            {textChannels.map(channel => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                }
                {!!audioChannels?.length &&
                    <div className='mb-2'>
                        {/* Channel headbar */}
                        <ServerSection
                            sectionType='channels'
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                        />
                        <div className='space-y-[2px]'>

                            {/* Channel content */}
                            {audioChannels.map(channel => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                }
                {!!videoChannels?.length &&
                    <div className='mb-2'>
                        {/* Channel headbar */}
                        <ServerSection
                            sectionType='channels'
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"
                        />
                        <div className='space-y-[2px]'>

                            {/* Channel content */}
                            {videoChannels.map(channel => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                }
                {!!server.members?.length &&
                    <div className='mb-2'>
                        {/* Channel headbar */}
                        <ServerSection
                            sectionType='members'
                            role={role}
                            label="Members"
                            server={server}
                        />
                        <div className='space-y-[2px]'>
                            {/* Channel content */}
                            {server.members.map(member => (
                                <ServerMember
                                    key={member.id}
                                    member={member}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                }
            </ScrollArea>
        </div>
    )
}
