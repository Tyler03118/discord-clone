"use client";
import { useState, useEffect } from "react";
import CreateServerModal from "../modals/create-server-modal";
import InviteModal from "../modals/invite-modal";
import ServerSettingModal from "../modals/server-setting-modal";
import ManageMembersModal from "../modals/manage-members";
import CreateChannelModal from "../modals/create-channel";
import LeaveServerModal from "../modals/leave-server";
import DeleteServerModal from "../modals/delete-server";
import DeleteChannelModal from "../modals/delete-channel";
import EditChannelModal from "../modals/edit-channel";
import MessageFileModal from "../modals/message-file-modal";
import DeleteMessageModal from "../modals/delete-message";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div>
            <CreateServerModal />
            <InviteModal />
            <ServerSettingModal />
            <ManageMembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <MessageFileModal />
            <DeleteMessageModal />
        </div>
    )
}
