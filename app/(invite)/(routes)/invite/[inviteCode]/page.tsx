// create the invite code page based on url
import React from 'react'
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import { currentProfile } from '@/lib/current-profile';

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    }
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return redirect('/login');
    }

    // check if the person has already joined this server
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingServer) {   // If the user is already in a server, redirect them to that server
        return redirect(`/servers/${existingServer.id}`)
    }

    // if not, update the server info to join
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    { profileId: profile.id, userId: profile.userId }
                ]
            }
        }
    });


    if (server) {
        redirect(`/servers/${server.id}`);
    }

    return null;
}

export default InviteCodePage;