'use client'
import React, { useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client'
import queryString from 'query-string'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Channel name cannot be empty.'
    }).refine(
        name => name !== 'general',
        {
            message: 'Channel name cannot be general.',
        }
    ),
    type: z.nativeEnum(ChannelType)
});


export default function CreateChannelModal() {
    const router = useRouter();

    const params = useParams();

    const { type, isOpen, closeModal, data } = useModalStore();

    const { channelType } = data;

    const isModalOpen = isOpen && type === 'createChannel';

    const handleClose = () => {
        form.reset();
        closeModal();
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channelType || ChannelType.TEXT,
        },
    });

    // set default value for channel type
    useEffect(() => {
        if (channelType) {
            form.setValue('type', channelType);
        } else {
            form.setValue('type', ChannelType.TEXT);
        }
    }, [channelType, form]);

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            const url = queryString.stringifyUrl({
                url: '/api/channels',
                query: {
                    serverId: params?.serverId,
                }
            });
            await axios.post(url, values);

            form.reset();
            router.refresh();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-center'>Create Channel</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase text-xs text-zinc-500 dark:text-zinc-300 font-bold'>Channel Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className='bg-zinc-300/50 border-0 focus-visible:ring-0'
                                            placeholder="Enter channel name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase text-xs text-zinc-500 dark:text-zinc-300 font-bold'>Channel Type</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="sm:max-w-[425px] text-zinc-500">
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(ChannelType)
                                                .map((type) => (<SelectItem key={type} value={type} className='capitalize'>
                                                    {type}
                                                </SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        <DialogFooter>
                            <Button disabled={isLoading} variant="primary">Create</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )

}
