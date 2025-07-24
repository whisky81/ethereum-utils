import { useContext } from "react";
import { Web3Context } from "../providers/Web3";

export function useWeb3Context() {
    return useContext(Web3Context);
}