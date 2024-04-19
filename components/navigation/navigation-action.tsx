'use client'
import React from 'react'
import { ActionTooltip } from '../action-tooltip'
import { Plus } from 'lucide-react'
import { useModalStore } from '@/hooks/use-modal-store';


export default function NavigationAction() {


    const { openModal } = useModalStore();


    return (
        <>
            <ActionTooltip label='Create a new server' side='right' align='center'>
                <button className="dark:bg-zinc-700 text-white rounded-full w-10 h-10 flex items-center justify-center dark:hover:bg-zinc-800" onClick={() => openModal('createServer')}>
                    <Plus className='text-green-700 hover:text-green-800' size={20} />
                </button>
            </ActionTooltip>
        </>
    )
}
