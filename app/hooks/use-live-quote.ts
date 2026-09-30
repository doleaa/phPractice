import {useAllTokens} from "~/hooks/use-all-tokens";
import {useEffect, useRef, useState} from "react";
import {getSimpleQuote} from "~/api/coinGecko/tokenClientUtil";
import {useDebouncedCallback} from "use-debounce";
import type {DisplayToken} from "~/types/tokens";

export const useLiveQuote = (): {
    allTokens: DisplayToken[];
    loadingOptions: boolean;
    from: string | undefined;
    to: string | undefined;
    setFrom: (value: string) => void;
    setTo: (value: string) => void;
    fromAmount: number | null;
    setFromAmount: (value: number | null) => void;
    toAmount: number | null;
    countDown: number | null;
} => {
    const {allTokens, loading: loadingOptions} = useAllTokens();

    const [from, setFrom] = useState<string | null>(null);
    const [to, setTo] = useState<string | null>(null);

    const fromValue: string | undefined = from ? from : allTokens.length ? allTokens[0].id : undefined;
    const toValue: string | undefined = to ? to : allTokens.length ? allTokens[1].id : undefined;

    const [fromAmount, setFromAmount] = useState<number | null>(null);
    const [toAmount, setToAmount] = useState<number | null>(null);

    const [countDown, setCountDown] = useState<number | null>(null);

    const latestRequestId = useRef(0);

    const fetchNewQuote = async (from: string, to: string, fromAmount: number) => {
        const requestId = ++latestRequestId.current;
        const quote = await getSimpleQuote(from, to);

        if (requestId !== latestRequestId.current) {
            return;
        }

        if (quote && fromAmount) {
            setToAmount(fromAmount * quote);
            setCountDown(15);
        }
    };

    useEffect(() => {
        if (countDown && countDown > 1) {
            const timeout = setTimeout(() => setCountDown(countDown - 1), 1000);
            return () => clearTimeout(timeout);
        }
        updateFromAmount();
    }, [countDown]);

    const updateFromAmount = useDebouncedCallback(() => {
        if (fromValue && toValue && fromAmount) {
            fetchNewQuote(fromValue, toValue, fromAmount);
        } else if (!fromAmount) {
            latestRequestId.current++;
            setCountDown(null);
            setToAmount(null);
        }
    }, 300);

    useEffect(updateFromAmount, [fromValue, toValue, fromAmount]);

    return {allTokens, loadingOptions, from: fromValue, to: toValue, setFrom, setTo, fromAmount, setFromAmount, toAmount, countDown};
};