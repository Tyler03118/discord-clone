import { currentProfile } from "@/lib/current-profile";
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

// Create a new server
export async function POST(req: Request) {

    try {
        // Get info from request body
        const { name, imageUrl } = await req.json();

        // Get current user profile, to see if the user is valid
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Create server and related data
        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: 'general', profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, userId: profile.userId, role: MemberRole.ADMIN }
                    ]
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse('Internal Server Error', { status: 500 });

    }
}