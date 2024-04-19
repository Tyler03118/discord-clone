'use client'
import React from 'react'
import { useState, useEffect } from 'react';
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
    FormDescription,
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

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Server name cannot be empty.'
    }),
    imageUrl: z.string().min(1, {
        message: 'Image must be uploaded.'
    }),
});


export default function InitialModal() {
    // handle hydration 
    const [isMouted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const router = useRouter();

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
            await axios.post('/api/servers', values);

            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    if (!isMouted) return null;

    return (
        <Dialog open>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-center'>Create your own server!</DialogTitle>
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
                                    <FormLabel className='uppercase text-xs text-zinc-500 font-bold dark:text-secondary/70'>Server Name</FormLabel>
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
                            <Button disabled={isLoading} variant="primary">Create</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )

}
