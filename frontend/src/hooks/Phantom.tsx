import { PhantomProvider } from "../types/Phantom";

export const usePhantom = () => {
    if ("solana" in window) {
        // @ts-ignore
        const provider_ = window.solana as any;
        if (provider_.isPhantom) return provider_ as PhantomProvider;
    }

    return null;
};
