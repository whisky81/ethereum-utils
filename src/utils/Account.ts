import type { Provider, Signer } from "ethers";
import { ethers, BrowserProvider, isAddress } from "ethers";

export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
    salt?: string;
}

class Account {
    public provider: Provider;
    public signer: Signer;
    public address: string;
    public networkName: string;
    public networkId: number;

    constructor(provider: Provider, signer: Signer) {
        this.provider = provider;
        this.signer = signer;
        this.address = '';
        this.networkName = '';
        this.networkId = 0;
    }

    public static async from(provider: Provider, signer: Signer): Promise<Account> {
        const account = new Account(provider, signer);
        account.address = await signer.getAddress();
        const network = await provider.getNetwork();

        account.networkName = network.name;
        account.networkId = parseInt(network.chainId.toString(), 10);

        return account;
    }
    
    public async getPrettyAddress(): Promise<string> {
        try {
            const address = await this.signer.getAddress();
            if (!address) throw new Error("Unknown address");

            const formattedAddress = address.toLowerCase();
            return `${formattedAddress.slice(0, 6)}...${formattedAddress.slice(-4)}`;
        } catch(error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to get pretty address: ${error.message}`);
            } else {
                throw new Error("An unknown error occurred while getting the pretty address.");
            }
        }
    }

    public async getBalance(): Promise<string> {
        try {

            const balance = await this.provider.getBalance(this.address);
            if (!balance) throw new Error("Failed to retrieve balance");

            return `${ethers.formatEther(balance)} ETH`;
        } catch(error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to get balance: ${error.message}`);
            } else {
                throw new Error("An unknown error occurred while getting the balance.");
            }
        }
    }

    public async signTypedData(
        domain: EIP712Domain, 
        typedDataStructor: Record<string, Array<{name: string, type: string}>>, 
        primaryType: string, 
        message: Object): Promise<[string, string]> {
        try {
            if (!domain.chainId || domain.chainId <= 0) throw new Error("Invalid chainId in domain");

            const params = JSON.stringify({
                types: {
                    EIP712Domain: this.getEIP712DomainType(domain.salt !== undefined),
                    ...typedDataStructor
                },
                primaryType: Account.styleTypedDataStructureName(primaryType),
                domain: domain,
                message: this.getFormattedMessage(typedDataStructor, primaryType, message)
            });
            
            const signature = await (this.provider as BrowserProvider).send("eth_signTypedData_v4", [this.address, params]);
            return [params, signature];
        } catch(error: any) {
            throw new Error(`Failed to sign typed data: ${error.message}`);
        }
    }

    private getFormattedMessage(typedDataStructor: Record<string, Array<{name: string, type: string}>>, primaryType: string, message: any): any {
        const formattedMessage: any = {};

        for (const obj of typedDataStructor[primaryType]) {
            const name = obj.name;
            const nameType = obj.type;

            if (!message.hasOwnProperty(name)) {
                throw new Error(`Message is missing required field: ${name}`);
            }

            if (nameType === "string") {
                formattedMessage[name] = message[name];
            } else if (nameType === "address") {
                const address = message[name];
                if (!isAddress(address)) {
                    throw new Error(`Invalid address for ${name}: ${address}`);
                }
                formattedMessage[name] = address.toLowerCase();
            } else if (nameType.startsWith("bytes")) {
                formattedMessage[name] = ethers.hexlify(ethers.toUtf8Bytes(message[name]));
            } else if (nameType.startsWith("uint")) {
                const num = BigInt(message[name]);
                if (num < 0) throw new Error(`Invalid value for ${name}: ${message[name]}`);
                formattedMessage[name] = num;
            } else if (nameType.startsWith("int")) {
                formattedMessage[name] = BigInt(message[name]);
            } else if (nameType === "bool") {
                formattedMessage[name] = Boolean(message[name]);
            } else {
                formattedMessage[name] = this.getFormattedMessage(typedDataStructor, nameType, message[name]);
            }
        }
        return formattedMessage;
    }

    private getEIP712DomainType(containSalt: boolean): Array<{name: string, type: string}> {
        const domainType: Array<{name: string, type: string}> = [
            {
                name: "name",
                type: "string"
            },
            {
                name: "version",
                type: "string"
            },
            {
                name: "chainId",
                type: "uint256"
            },
            {
                name: "verifyingContract",
                type: "address"
            }
        ];
        if (containSalt) {
            domainType.push({
                name: "salt",
                type: "bytes32"
            });
        }
        return domainType;
    }

    static styleTypedDataStructureName(name: string): string {
        name = name.trim();
        if (name.length === 0) return "";
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase().trim();
    }
}

export default Account;