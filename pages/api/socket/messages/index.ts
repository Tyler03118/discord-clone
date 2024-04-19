import { currentProfilePages } from "@/lib/current-profile-pages";
import db from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { log } from "console";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {

        const profile = await currentProfilePages(req);

        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;


        if (!profile) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (serverId === 'undefined' || channelId === 'undefined') {
            return res.status(400).json({ message: 'Bad request' });
        }

        if (!content) {
            return res.status(400).json({ message: 'Content missing' });
        }


        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });



        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }

        // find channel
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        });

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        // find member
        const member = server.members.find((m) => m.profileId === profile.id);

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }


        const message = await db.message.create({
            data: {
                content,
                fileUrl: fileUrl || null,
                channelId: channel.id,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }

        });

        // emit a socket io to all the active connections
        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    } catch (error) {
        console.log("[MESSAGES_POST_ERROR]", error);
        return res.status(500).json({ message: 'Internal server error', details: error });


    }
}