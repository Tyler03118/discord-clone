// Update the invite code
import { currentProfile } from "@/lib/current-profile";
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from "next/server";

// Create a new server
export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {

    try {
        // Get current user profile, to see if the user is valid
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { serverId } = params;

        if (!serverId) {
            return new NextResponse('Server Id Missing', { status: 400 });
        }

        // update the server's invite code
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: uuidv4()
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse('Internal Server Error', { status: 500 });

    }
}