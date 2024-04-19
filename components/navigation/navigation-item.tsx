'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image';

interface NavigationItemProps {
    id: string;
    name: string;
    imageUrl: string;
}

export default function NavigationItem({ id, name, imageUrl }: NavigationItemProps) {

    const router = useRouter();
    const params = useParams();

    const nav = () => {
        router.push(`/servers/${id}`);
    }

    return (
        <button className='group relative flex items-center' onClick={nav}>
            <div className={cn(
                "absolute left-0 bg-primary w-[4px] rounded-r-full transition-all",
                params?.serverId !== id && "group-hover:h-[20px]",
                params?.serverId === id ? "h-[36px]" : "h-[8px]"
            )} />
            <div className={cn(
                "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
            )}>
                <Image src={imageUrl} alt='Channel' layout='fill' objectFit='cover' />
            </div>
        </button>
    )
}
