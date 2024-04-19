'use client';

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import axios from 'axios';

export default function DeleteServerModal() {

    const router = useRouter();

    const { type, isOpen, closeModal, data, openModal } = useModalStore();

    const { server } = data;

    const isModalOpen = isOpen && type === 'deleteServer';

    const handleClose = () => {
        closeModal();
    }

    const onLeaveServer = async () => {
        try {
            await axios.delete(`/api/servers/${server?.id}`);

            router.refresh();
            closeModal();
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Server</DialogTitle>
                    <DialogDescription className='pt-3'>
                        Are you sure you want to do this? <span className='text-indigo-500 font-bold'>{server?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>


                <DialogFooter className='flex items-center justify-center mt-2'>
                    <Button
                        onClick={handleClose}
                        variant='secondary'
                        className='mr-2'>
                        Cancel
                    </Button>
                    <Button
                        onClick={onLeaveServer}
                        variant='primary'>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}
