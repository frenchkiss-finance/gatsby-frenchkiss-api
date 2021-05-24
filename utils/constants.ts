import { ChainId, Token } from "@frenchkiss-libs/sdk";

// BEP-20 addresses.
export const KISS = "0x3b44b0cFe3a290906F3C6479df56457db9d7cd59";
export const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
export const DEAD = "0x000000000000000000000000000000000000dEaD";

// Contract addresses.
export const KISS_BNB_FARM = "0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6";
export const MASTERCHEF_CONTRACT = "0x73feaa1eE314F8c655E354234017bE2193C9E24E";
export const LOTTERY_CONTRACT = "0x3C3f2049cc17C136a604bE23cF7E42745edf3b91";
export const MULTICALL_CONTRACT = "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb";

// FrenchKiss Finance SDK Token.
export const KISS_TOKEN = new Token(ChainId.MAINNET, KISS, 18);
export const WBNB_TOKEN = new Token(ChainId.MAINNET, WBNB, 18);
export const KISS_BNB_TOKEN = new Token(ChainId.MAINNET, KISS_BNB_FARM, 18);
