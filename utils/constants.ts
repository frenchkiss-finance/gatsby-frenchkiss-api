import { ChainId, Token } from "@frenchkiss-libs/sdk";

// BEP-20 addresses.
export const KISS = "0x3b44b0cFe3a290906F3C6479df56457db9d7cd59";
export const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
export const DEAD = "0x000000000000000000000000000000000000dEaD";

// Contract addresses.
export const KISS_BNB_FARM = "0x66824216508e6EB29Cad4613916E3265a4dEE825";
export const MASTERCHEF_CONTRACT = "";
export const MULTICALL_CONTRACT = "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb";

// FrenchKiss Finance SDK Token.
export const KISS_TOKEN = new Token(ChainId.MAINNET, KISS, 18);
export const WBNB_TOKEN = new Token(ChainId.MAINNET, WBNB, 18);
export const KISS_BNB_TOKEN = new Token(ChainId.MAINNET, KISS_BNB_FARM, 18);
