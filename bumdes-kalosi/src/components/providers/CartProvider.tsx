"use client";

import { CartProvider as ReactUseCartProvider } from "react-use-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
    return (
        <ReactUseCartProvider>
            {children}
        </ReactUseCartProvider>
    );
}
