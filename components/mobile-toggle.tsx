import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Menu } from 'lucide-react';
import React from 'react'
import { NavigationSidebar } from "./navigation/navigation-sidebar";
import ServerSidebar from "./servers/server-sidebar";

interface MobileToggleProps {
    serverId: string;
}

export default function MobileToggle({ serverId }: MobileToggleProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 gap-0 flex bg-zinc-800">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <div className="w-[330px]">
                    <ServerSidebar serverId={serverId} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
