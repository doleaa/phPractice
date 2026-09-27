import {useInfiniteList} from "~/hooks/use-infinite-list";
import {TokenList} from "~/components/TokenList";
import {useInView} from "~/hooks/use-in-view";
import {useEffect} from "react";

export default function InfiniteList() {
    const {allTokens, hasMore, nextPage, loading, errorMessage} = useInfiniteList(10);
    const [endRef, atEndRef] = useInView<HTMLDivElement>({rootMargin: '15px'});

    useEffect(() => {
        if (atEndRef && hasMore && !loading && !errorMessage) {
            nextPage();
        }
    }, [atEndRef, hasMore, loading]);

    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-9 min-h-0">
                {errorMessage && (
                    <div className="flex items-center justify-center text-red-500">
                        {errorMessage}
                    </div>
                )}
                <TokenList tokens={allTokens} />
                {loading && (
                    <div className="flex items-center justify-center text-blue-100">
                        Loading...
                    </div>
                )}
                {hasMore && !loading && (
                    <div className="flex items-center justify-center">
                        {/* @ts-ignore */}
                        <div ref={endRef} className="flex justify-center"> More to load </div>
                    </div>
                )}
            </div>
        </main>
    );
};