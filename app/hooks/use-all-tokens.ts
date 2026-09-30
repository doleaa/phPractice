import {useEffect, useRef, useState} from "react";
import type {DisplayToken} from "~/types/tokens";
import {getAllTokensSortedByMarketCapRank} from "~/api/coinGecko/tokenClientUtil";

export const useAllTokens = (): { allTokens: DisplayToken[]; loading: boolean; } => {
    const [allTokens, setAllTokens] = useState<DisplayToken[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const inFlight = useRef(false);

    useEffect(() => {
        if (inFlight.current) {
            return;
        }
        inFlight.current = true;
        setLoading(true);
        getAllTokensSortedByMarketCapRank()
            .then(setAllTokens)
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
                inFlight.current = false;
            });
    }, []);

    return {allTokens, loading};
};