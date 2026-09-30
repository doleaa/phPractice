import {useLiveQuote} from "~/hooks/use-live-quote";

export default function LiveSwap() {
    const {
        allTokens,
        loadingOptions,
        from,
        to,
        setFrom,
        setTo,
        fromAmount,
        setFromAmount,
        toAmount,
        countDown
    } = useLiveQuote();

    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-9 min-h-0">
                {/*{loading ? (*/}
                {loadingOptions ? (
                    <div className="flex flex-wrap gap-3">
                        <div>Loading...</div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center gap-9 min-h-0">
                            <div className="flex flex-wrap gap-3">
                                <select value={from} onChange={e => setFrom(e.target.value)}>
                                    {
                                        allTokens.map(token => (
                                            <option key={token.id} value={token.id}>{token.name}</option>
                                        ))
                                    }
                                </select>
                                <select value={to} onChange={e => setTo(e.target.value)}>
                                    {
                                        allTokens.map(token => (
                                            <option key={token.id} value={token.id}>{token.name}</option>
                                        ))
                                    }
                                </select>
                                <input
                                    type="number"
                                    className="bg-amber-700"
                                    value={fromAmount}
                                    // @ts-ignore
                                    // onInput={(event) => setFromAmount(Number(event.target.value))}
                                    onInput={(event) => setFromAmount(Number(event.target.value))}
                                />
                                <div className="text-red-300 bg-amber-100 min-w-[50px]">{toAmount}</div>
                            </div>
                        <div className="flex flex-wrap bg-pink-600">
                            {countDown}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}