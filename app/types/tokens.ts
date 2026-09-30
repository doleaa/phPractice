export interface DisplayToken {
    id: string;
    name: string;
    logoUrl: string;
    symbol: string;
    marketCapRank: number;
    currentPrice?: number;
    lastDayPriceChangePercentage?: number;
}

export interface TokenDetails {
    id: string;
    name: string;
    api_symbol: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
}

export interface TokenMarketInfo {
    id: string;
    symbol: string;
    name: string;
    image: string; // url
    current_price: number;
    market_cap: number;
    market_cap_rank: number
    fully_diluted_valuation: number
    total_volume:number
    high_24h: number;
    low_24h: number
    price_change_24h: number;
    price_change_percentage_24h: number;
}

export interface SimpleQuoteResponse {
    [key: string]: { [fiatKey: string]: number};
}

