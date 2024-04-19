'use client'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '../ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FileUpload } from '../file-upload';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import { useEffect } from 'react';

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Server name cannot be empty.'
    }),
    imageUrl: z.string().min(1, {
        message: 'Image must be uploaded.'
    }),
});


export default function ServerSettingModal() {

    const router = useRouter();

    const { type, isOpen, closeModal, data } = useModalStore();

    const isModalOpen = isOpen && type === 'serverSetting';

    const server = data.server;

    const handleClose = () => {
        form.reset();
        closeModal();
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await axios.patch(`/api/servers/${server?.id}`, values);

            form.reset();
            router.refresh();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    }

    // pre load the form data
    useEffect(() => {
        if (server) {
            form.setValue('name', server.name);
            form.setValue('imageUrl', server.imageUrl);
        }
    }, [server, form]);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-center'>Edit the Server</DialogTitle>
                    <DialogDescription className='text-center pt-3'>
                        Give your server a personality with a name and an image. You can always change these later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className='flex items-center justify-center text-center'>
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload endpoint="serverImage" value={field.value}
                                                onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase text-xs text-zinc-200 dark:text-zinc-500 font-bold'>Server Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className='bg-zinc-300/50 border-0 focus-visible:ring-0'
                                            placeholder="Enter server name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={isLoading} variant="primary">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )

}
