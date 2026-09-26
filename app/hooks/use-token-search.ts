import {useCallback, useEffect, useRef, useState} from "react";
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
    reload: () => void;
    resultTokens: DisplayToken[];
    loadingState: LoadingState;
    errorMessage: string;
} => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 100);

    const [loadingState, setLoadingState] = useState<LoadingState>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [resultTokens, setResultTokens] = useState<DisplayToken[]>([]);

    const abortController = useRef<AbortController>(null);

    const runDebouncedSearch = useDebouncedCallback((givenSearchString: string) => {
        setLoadingState('loadingList');
        setErrorMessage("");

        abortController.current?.abort();
        abortController.current = new AbortController();

        getRelevantTokensBasedOnSearch(givenSearchString, abortController.current?.signal).then((tokens) => {
            setResultTokens(tokens);
            setLoadingState('loadingPrices');
            hydrateTokensPrices(tokens, abortController.current?.signal)
                .then(setResultTokens)
                .catch(error => {
                    if (abortController.current?.signal.aborted) {
                        return;
                    }
                    setErrorMessage(error.message);
                    console.error(`Hydration error on page: ${error.message}`);
                })
                .finally(() => setLoadingState(null));
        }).catch(error => {
            if (abortController.current?.signal.aborted) {
                return;
            }
            setErrorMessage(error.message);
            console.error(`Search error on page: ${error.message}`);
        }).finally(() => setLoadingState(null));
    }, 300);

    const runDebouncedTopTokensLookup = useDebouncedCallback(() => {
        setLoadingState('loadingList');
        setErrorMessage("");

        abortController.current?.abort();
        abortController.current = new AbortController();

        getTopTokensByMarketCapRank(abortController.current?.signal)
            .then(setResultTokens)
            .catch(error => {
                if (abortController.current?.signal.aborted) {
                    return;
                }
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

    const reload = useCallback(() => {
        if (debouncedQuery) {
            runDebouncedSearch(debouncedQuery);
        } else {
            runDebouncedTopTokensLookup();
        }
    }, [debouncedQuery]);

    return {query, setQuery, reload, resultTokens, loadingState, errorMessage};
};