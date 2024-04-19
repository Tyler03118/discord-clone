import { currentProfile } from "@/lib/current-profile";
import db from '@/lib/db';
import { NextResponse } from "next/server";

// update the member role
export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {

    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        const { role } = await req.json();

        if (!serverId) {
            return new NextResponse('Missing Server Id', { status: 400 });
        }

        if (!params.memberId) {
            return new NextResponse('Missing Member Id', { status: 400 });
        }

        // update the role
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                },
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
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

// delete the member
export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {

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

        if (!params.memberId) {
            return new NextResponse('Missing Member Id', { status: 400 });
        }

        // update the role
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
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