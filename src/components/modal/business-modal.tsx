"use client";

import { Modal } from "@/components/modal";
import { modalHooks } from "@/hooks/modal-hooks";

export const StoreModal = () => {
    const hooks = modalHooks()

    return (
        <Modal 
        title="Create a new Business" 
        description="Add a new Caff Business to your account" 
        isOpen={hooks.isOpen} 
        onClose={hooks.onClose}
        >
            Form to create new store
        </Modal>
    )
}