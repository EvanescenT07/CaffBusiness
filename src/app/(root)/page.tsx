"use client";
import { Modal } from "@/components/modal";
import { modalHooks } from "@/hooks/modal-hooks";
import React, { useEffect } from "react";

const SetupPage = () => {
    const onOpen = modalHooks((state) => state.onOpen)
    const isOpen = modalHooks((state) => state.isOpen)

    useEffect(() => {
        if(!isOpen) {
            onOpen()
        }
    }, [isOpen, onOpen])
    return null;
}

export default SetupPage;