import { currentProfile } from "@/lib/current-profile";
import db from '@/lib/db';
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

// create a new channel
export async function DELETE(req: Request, { params }: { params: { channelId: string } },
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');

        if (!serverId) {
            return new NextResponse('Missing Server Id', { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse('Missing Channel Id', { status: 400 });
        }

        // delete the
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
                    delete: {
                        id: params.channelId,
                        name: {
                            not: 'general'
                        }
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

// update the channel
export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {

    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');

        const { name, type } = await req.json();

        if (!serverId) {
            return new NextResponse('Missing Server Id', { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse('Missing Channel Id', { status: 400 });
        }

        if (name === 'general') {
            return new NextResponse('Channel name cannot be general.', { status: 400 });
        }

        // update the channel info
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
                    update: {
                        where: {
                            id: params.channelId
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse('Internal Server Error', { status: 500 });

    }
}