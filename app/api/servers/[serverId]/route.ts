import { currentProfile } from "@/lib/current-profile";
import db from '@/lib/db';
import { NextResponse } from "next/server";

// update the server
export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {

    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { name, imageUrl } = await req.json();

        // update the server info
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl,
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse('Internal Server Error', { status: 500 });

    }
}

// Delete the server
export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {

    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse('Server not found', { status: 404 });
        }

        // delete the server info
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse('Internal Server Error', { status: 500 });

    }
}