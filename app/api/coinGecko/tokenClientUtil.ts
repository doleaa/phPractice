import type {TokenDetails, TokenMarketInfo, DisplayToken} from "~/types/tokens";

const toDisplayInfo = (givenToken: TokenDetails): DisplayToken => ({
    id: givenToken.id,
    name: givenToken.name,
    logoUrl: givenToken.large,
    symbol: givenToken.symbol,
    marketCapRank: givenToken.market_cap_rank,
});

const toCompleteDisplayInfo = (givenToken: TokenMarketInfo): DisplayToken => ({
    id: givenToken.id,
    name: givenToken.name,
    logoUrl: givenToken.image,
    symbol: givenToken.symbol,
    marketCapRank: givenToken.market_cap_rank,
    currentPrice: givenToken.current_price,
    lastDayPriceChangePercentage: givenToken.price_change_percentage_24h
});

const getErrorMessageByStatus = (status: number): string => {
    switch (status) {
        case 429:
            return "Too Many Requests";
        case 500:
            return "Internal Server Error";
        default:
            return "Unknown Error";
    }
};

export const getRelevantTokensBasedOnSearch = async (givenSearchString: string, abortSignal?: AbortSignal): Promise<DisplayToken[]> => {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/search?query=${givenSearchString}`,
            abortSignal && {signal: abortSignal}
        );

        if (!response.ok) {
            throw new Error(`Token search: ${getErrorMessageByStatus(response.status)}`);
        }

        const result = await response.json();
        console.log(`Token Search call response: ${JSON.stringify(result)}`);

        if (result.coins && result.coins.length > 0) {
            return result.coins
                .sort((a: TokenDetails, b:TokenDetails) => a.market_cap_rank - b.market_cap_rank)
                .slice(0, 20)
                .map(toDisplayInfo);
        }
    } catch (error) {
        // @ts-ignore
        console.error(`Token Search call error: ${error.message}`);
        throw error;
    }

    return [];
};

export const getTopTokensByMarketCapRank = async (abortSignal?: AbortSignal): Promise<DisplayToken[]> => {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd',
            abortSignal && {signal: abortSignal}
        );

        if (!response.ok) {
            throw new Error(`Top Token search: ${getErrorMessageByStatus(response.status)}`);
        }

        const result = await response.json();
        console.log(`Token Market Info call response: ${JSON.stringify(result)}`);

        if (result.length > 0) {
            return result
                .sort((a: TokenDetails, b:TokenDetails) => a.market_cap_rank - b.market_cap_rank)
                .slice(0, 20)
                .map(toCompleteDisplayInfo);
        }
    } catch (error) {
        // @ts-ignore
        console.error(`Top Token Search call error: ${error.message}`);
        throw error;
    }

    return [];
};

export const hydrateTokensPrices = async (givenTokens: DisplayToken[], abortSignal?: AbortSignal): Promise<DisplayToken[]> => {
    console.log("Got to the hydration point.");

    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${givenTokens.map(coin => coin.id).join(',')}`,
            abortSignal && {signal: abortSignal}
        );

        if (!response.ok) {
            throw new Error(`Token prices search: ${getErrorMessageByStatus(response.status)}`);
        }

        const result = await response.json();
        console.log(`Token Market Info call response: ${JSON.stringify(result)}`);
        if (result.length > 0) {
            const pricingData: { [key: string]: TokenMarketInfo } =
                result.reduce((accumulator: { [key: string]: TokenMarketInfo }, tokenMarketInfo: TokenMarketInfo) => {
                    accumulator[tokenMarketInfo.id] = tokenMarketInfo;
                    return accumulator;
                }, {});

            return givenTokens.map(displayToken => ({
                ...displayToken,
                currentPrice: pricingData[displayToken.id]?.current_price,
                lastDayPriceChangePercentage: pricingData[displayToken.id]?.price_change_percentage_24h
            }));
        }

    } catch (error) {
        // @ts-ignore
        console.error(`Hydrate token prices call error: ${error.message}`);
        throw error;
    }

    return [];
};