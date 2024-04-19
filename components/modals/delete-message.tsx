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
import { useParams, useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import axios from 'axios';
import queryString from 'query-string';

export default function DeleteMessageModal() {

    const router = useRouter();

    const { type, isOpen, closeModal, data, openModal } = useModalStore();

    const { apiUrl, query } = data;

    const [isLoading, setIsLoading] = React.useState(false);

    const isModalOpen = isOpen && type === 'deleteMessage';

    const handleClose = () => {
        closeModal();
    }

    const onLeaveServer = async () => {
        try {
            setIsLoading(true);
            const url = queryString.stringifyUrl({
                url: apiUrl || "",
                query
            })
            await axios.delete(url);
            closeModal();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Message</DialogTitle>
                    <DialogDescription className='pt-3'>
                        Are you sure you want to do this? The message will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>


                <DialogFooter className='flex items-center justify-center mt-2'>
                    <Button
                        disabled={isLoading}
                        onClick={handleClose}
                        variant='secondary'
                        className='mr-2'>
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={onLeaveServer}
                        variant='primary'>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}
