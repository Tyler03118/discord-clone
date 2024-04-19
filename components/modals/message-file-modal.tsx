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
    FormMessage,
} from "@/components/ui/form"
import { Button } from '../ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FileUpload } from '../file-upload';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import queryString from 'query-string';

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: 'Attachment must be uploaded.'
    }),
});


export default function MessageFileModal() {

    const { isOpen, openModal, closeModal, type, data } = useModalStore();

    const { apiUrl, query } = data;

    const router = useRouter();

    const isModalOpen = isOpen && type === 'messageFile';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const url = queryString.stringifyUrl({
                url: apiUrl || "",
                query
            });
            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });

            form.reset();
            router.refresh();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    }

    const handleClose = () => {
        form.reset()
        closeModal();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-center'>Add an attachment</DialogTitle>
                    <DialogDescription className='text-center pt-3'>
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className='flex items-center justify-center text-center'>
                            <FormField
                                control={form.control}
                                name="fileUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload endpoint="messageFile" value={field.value}
                                                onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button disabled={isLoading} variant="primary">Send</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )

}
