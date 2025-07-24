import { createContext, useEffect, useState } from "react";
import Account from '../utils/Account';
import { ethers } from "ethers";

export interface IWeb3 {
    account: Account | null; 
    isLoading: boolean;
    error: string | null;
}

export const Web3Context = createContext<IWeb3>({
    account: null,
    isLoading: true,
    error: null,
});


function Web3({ children }: { children: React.ReactNode }) {
    const [account, setAccount] = useState<Account | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // @ts-ignore
                if (!window?.ethereum) {
                    throw new Error("MetaMask is not installed");
                }

                // @ts-ignore
                const _provider = new ethers.BrowserProvider(window.ethereum);
                await _provider.send("eth_requestAccounts", []);
                const _signer = await _provider.getSigner();

                setAccount(await Account.from(_provider, _signer));
                setError(null);

                // @ts-ignore
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                })
                // @ts-ignore
                window.ethereum.on('accountsChanged', () => {
                    window.location.reload();
                })

            } catch(e: unknown) {
                if (e instanceof Error) setError(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        init();
        return () => {
            // @ts-ignore
            if (!window?.ethereum) return;
            // @ts-ignore
            window.ethereum?.removeAllListeners();
        }
    }, []);


    return <Web3Context.Provider value={{ account, isLoading, error }}>
        {children}
    </Web3Context.Provider>;
}

export default Web3;