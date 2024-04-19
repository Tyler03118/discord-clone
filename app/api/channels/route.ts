import { currentProfile } from "@/lib/current-profile";
import db from '@/lib/db';
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

// create a new channel
export async function POST(req: Request, { params }: { params: { serverId: string } },
) {

    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        const { name, type } = await req.json();

        if (name === 'general' || name === 'General') {
            return new NextResponse('Channel name cannot be general.', { status: 400 });
        }

        if (!serverId) {
            return new NextResponse('Missing Server Id', { status: 400 });
        }

        // create the
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        name,
                        type,
                        profileId: profile.id
                    }
                }
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse('Internal Server Error', { status: 500 });

    }
}