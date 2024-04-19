import ChatHeader from '@/components/channels/chat-header';
import ChatInput from '@/components/channels/chat-input';
import ChatMessages from '@/components/channels/chat-messages';
import MediaRoom from '@/components/media-room';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  },
  searchParams: {
    video?: string;

  }
}

export default async function MemberIdPage({ params, searchParams }: MemberIdPageProps) {

  const profile = await currentProfile();
  if (!profile) {
    return redirect('/login');
  }

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId
    },
    include: {
      profile: true
    }
  });

  if (!currentMember) {
    return redirect('/');
  }

  // create the new convo
  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}}`);
  }

  const { memberOne, memberTwo } = conversation;

  // get the other member we are talking to
  const otherMember = memberOne.id === profile.id ? memberTwo : memberOne;


  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader imageUrl={otherMember.profile.imageUrl} name={otherMember.profile.name} serverId={params.serverId} type="conversation" />
      {searchParams.video && (<>
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      </>)}
      {!searchParams.video && (<>
        <ChatMessages name={otherMember.profile.name} member={currentMember} chatId={conversation.id} apiUrl='/api/direct-messages' socketUrl='/api/socket/direct-messages' socketQuery={{ conversationId: conversation.id }} paramKey="conversationId" paramValue={conversation.id} type="conversation" />
        <ChatInput name={otherMember.profile.name} apiUrl='/api/socket/direct-messages' query={{ conversationId: conversation.id }} type="conversation" />
      </>)}

    </div>
  )
}
