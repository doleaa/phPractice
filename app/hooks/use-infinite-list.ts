import {useCallback, useEffect, useRef, useState} from "react";
import type {DisplayToken} from "~/types/tokens";
import {getPaginatedTopTokensByMarketCapRank} from "~/api/coinGecko/tokenClientUtil";
import {useDebouncedCallback} from "use-debounce";

export const useInfiniteList = (initialPageSize: number = 10): {
    currentPage: number;
    allTokens: DisplayToken[];
    setPageSize: (pageSize: number) => void;
    hasMore: boolean;
    nextPage: () => void;
    loading: boolean;
    errorMessage: string;
} => {
    const [pageSize, setPageSize] = useState(initialPageSize);

    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [allTokens, setAllTokens] = useState<DisplayToken[]>([]);

    const inFlight = useRef(false);

    const loadPage = (givenPageSize: number, givenPage: number) => {
        if (inFlight.current) {
            return;
        }

        inFlight.current = true;
        setLoading(true);
        setErrorMessage('');

        getPaginatedTopTokensByMarketCapRank(givenPageSize, givenPage)
            .then((tokensOnPage: DisplayToken[]) => {
                setHasNextPage(givenPageSize === tokensOnPage.length);
                setAllTokens(allTokens.concat(tokensOnPage));
            })
            .catch(error => {
                setErrorMessage(error.message);
                console.error(`Tokens page load error on page: ${error.message}. Page: ${currentPage}; PageSize: ${pageSize}.`);
            })
            .finally(() => {
                inFlight.current = false;
                setLoading(false);
            });
    };

    const nextPage = useCallback(() => setCurrentPage(currentPage + 1), [currentPage]);

    useEffect(() => {
        loadPage(pageSize, currentPage);
    }, [currentPage, pageSize]);

    return {
        currentPage,
        allTokens,
        setPageSize,
        hasMore: hasNextPage,
        nextPage,
        loading,
        errorMessage,
    };
};