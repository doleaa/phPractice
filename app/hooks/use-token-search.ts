import {useEffect, useState} from "react";
import type {DisplayToken} from "~/types/tokens";
import {useDebouncedCallback} from "use-debounce";
import {
    getRelevantTokensBasedOnSearch,
    getTopTokensByMarketCapRank,
    hydrateTokensPrices
} from "~/api/coinGecko/tokenClientUtil";

const useDebouncedValue = (value: string, delayMs: number) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounced(value);
        }, delayMs);

        return () => clearTimeout(timeout);
    }, [value, delayMs]);
    return debounced;
};

type LoadingState = 'loadingList' | 'loadingPrices' | null;

export const useTokenSearch = (): {
    query: string;
    setQuery: (givenQuery: string) => void;
    resultTokens: DisplayToken[];
    loadingState: LoadingState;
    errorMessage: string;
} => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 100);

    const [loadingState, setLoadingState] = useState<LoadingState>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [resultTokens, setResultTokens] = useState<DisplayToken[]>([]);

    const runDebouncedSearch = useDebouncedCallback((givenSearchString: string) => {
        setLoadingState('loadingList');
        setErrorMessage("");

        getRelevantTokensBasedOnSearch(givenSearchString).then((tokens) => {
            setResultTokens(tokens);
            setLoadingState('loadingPrices');
            hydrateTokensPrices(tokens)
                .then(setResultTokens)
                .catch(error => {
                    setErrorMessage(error.message);
                    console.error(`Hydration error on page: ${error.message}`);
                })
                .finally(() => setLoadingState(null));
        }).catch(error => {
            setErrorMessage(error.message);
            console.error(`Search error on page: ${error.message}`);
        }).finally(() => setLoadingState(null));
    }, 300);

    const runDebouncedTopTokensLookup = useDebouncedCallback(() => {
        setLoadingState('loadingList');
        setErrorMessage("");

        getTopTokensByMarketCapRank()
            .then(setResultTokens)
            .catch(error => {
                setErrorMessage(error.message);
                console.error(`Top token search error on page: ${error.message}`);
            });
    }, 300);

    useEffect(() => {
        if (debouncedQuery) {
            runDebouncedSearch(debouncedQuery);
        } else {
            runDebouncedTopTokensLookup();
        }
    }, [debouncedQuery]);

    return {query, setQuery, resultTokens, loadingState, errorMessage};
};