'use client';

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '../ui/button';
import { CheckCheck, Copy, RefreshCw } from "lucide-react"
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';
import { useState } from 'react';
import axios from 'axios';

export default function InviteModal() {

    const router = useRouter();

    const { type, isOpen, closeModal, data, openModal } = useModalStore();

    const origin = useOrigin();
    const { server } = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const isModalOpen = isOpen && type === 'invite';

    const [copied, setCopied] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        closeModal();
    }

    const onCopy = async () => {
        await navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    const onNewLink = async () => {
        // use axios to generate a new invite code
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            openModal('invite', { server: response.data }); // use for refresh
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
                    <DialogTitle>Invite Friends</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to enter the server.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            value={inviteUrl}
                            readOnly
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading} type="submit" size="sm" className="px-3" onClick={() => onCopy()}>
                        <span className="sr-only">Copy</span>
                        {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>

                <button disabled={isLoading} className='flex items-center justify-start hover:text-zinc-500 text-xs ml-3' onClick={() => onNewLink()}>
                    Generate a new link
                    <RefreshCw className="h-3 w-3 ml-2" />
                </button>
            </DialogContent>
        </Dialog>
    )

}
