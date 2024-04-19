import { create } from 'zustand';
import { ChannelType, Server, Channel } from '@prisma/client';

type ModalType = 'createServer' | 'invite' | 'serverSetting' | 'manageMembers' | 'createChannel' | 'leaveServer' | 'deleteServer' | 'deleteChannel' | 'editChannel' | 'messageFile' | 'deleteMessage';

interface ModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType; // used for default value of +
    apiUrl?: string;
    query?: Record<string, any>;
}

interface ModalState {
    type: ModalType | null;
    isOpen: boolean;
    data: ModalData;
    openModal: (type: ModalType, data?: ModalData) => void;
    closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    openModal: (type, data = {}) => set({ type, isOpen: true, data }),
    closeModal: () => set({ type: null, isOpen: false }),
}));

