'use client';

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useModalStore } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';

export default function ManageMembersModal() {

    const { type, isOpen, closeModal, data, openModal } = useModalStore();
    const { server } = data as { server: ServerWithMembersWithProfiles };

    const isModalOpen = isOpen && type === 'manageMembers';

    const handleClose = () => {
        closeModal();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage Members</DialogTitle>
                    <DialogDescription>
                        {server?.members.length} members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea>
                    {server?.members?.map((member) =>
                        <UserAvatar key={member.id} src={member.profile} member={member} />)}
                </ScrollArea>



            </DialogContent>
        </Dialog>
    )

}
