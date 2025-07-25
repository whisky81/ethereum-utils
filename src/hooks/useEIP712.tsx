import { useEffect, useState } from "react";
import { useWeb3Context } from "./useWeb3Context";
import type { EIP712Domain } from "../utils/Account";

function useEIP712() {
    const { account } = useWeb3Context();
    const [error, setError] = useState<string | null>(null);

    const [domainSeparator, setDomainSeparator] = useState<EIP712Domain>({
        name: "",
        version: "",
        chainId: 0,
        verifyingContract: ""
    });
    const [typedDataStructures, setTypedDataStructures] = useState<Record<string, Array<{ name: string, type: string }>>>({});
    const [primaryType, setPrimaryType] = useState<string>("");
    const [message, setMessage] = useState<Record<string, any>>({});
    const [step, setStep] = useState(1);
    const [paramsAndSignature, setParamsAndSignature] = useState<{ params: string, signature: string }>({ params: "", signature: "" });

    const reset = (params: string, signature: string) => {
        if (!account) throw new Error("No account available");
        setParamsAndSignature({ params, signature });
        setDomainSeparator({
            name: "",
            version: "",
            chainId: account.networkId,
            verifyingContract: ""
        });
        setTypedDataStructures({});
        setPrimaryType("");
        setMessage({});
        setStep(0);
    }

    const signing = async () => {
        try {
            if (!account) throw new Error("No account available");
            const res = await account.signTypedData(domainSeparator, typedDataStructures, primaryType, message)

            if (!res[0] || !res[1]) {
                throw new Error("Signing failed");
            }
            reset(res[0], res[1]);
        } catch (e: any) {
            setError(e.message || "An error occurred during signing");
        }
    }

    useEffect(() => {
        const load = async () => {
            try {
                if (!account) throw new Error("No account available");
                setDomainSeparator({
                    ...domainSeparator,
                    chainId: account.networkId,
                });
            } catch (error: any) {
                setError(error.message || "An error occurred while loading account information");
            }
        }
        load();
    }, [account]);
    

    return {
        error, setError,
        domainSeparator, setDomainSeparator,
        typedDataStructures, setTypedDataStructures,
        primaryType, setPrimaryType,
        message, setMessage,
        step, setStep,
        paramsAndSignature,
        signing
    };
}

export default useEIP712;