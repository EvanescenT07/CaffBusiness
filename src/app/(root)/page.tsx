"use client";
import { modalHooks } from "@/hooks/modal-hooks";
import { useEffect } from "react";

const SetupPage = () => {
    const onOpen = modalHooks((state) => state.onOpen)
    const isOpen = modalHooks((state) => state.isOpen)

    useEffect(() => {
        if (!isOpen) {
            onOpen()
        }
    }, [isOpen, onOpen])
    return null;
}

export default SetupPage;