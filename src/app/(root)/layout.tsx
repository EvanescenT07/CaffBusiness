import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const setLayout = ({ children }: LayoutProps) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default setLayout;