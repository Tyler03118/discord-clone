import React from 'react'
import { initialPage } from '@/lib/initial-profile';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import InitialModal from '@/components/modals/initial-modal';

const SetupPage = async () => {

    const profile = await initialPage();

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (server) {   // If the user is already in a server, redirect them to that server
        return redirect(`/servers/${server.id}`)
    }

    return (
        <div>
            <InitialModal />
        </div>
    )
}

export default SetupPage;