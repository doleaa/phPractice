import {SearchField} from "~/components/SearchField";
import {TokenList} from "~/components/TokenList";
import {useTokenSearch} from "~/hooks/use-token-search";

export default function TokenSearch() {
    const {
        query,
        setQuery,
        reload,
        resultTokens,
        errorMessage,
    } = useTokenSearch();

    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-9 min-h-0">
                <div className="flex flex-wrap">
                    <SearchField value={query} onChange={setQuery} />
                    {errorMessage && (<button className="bg-amber-700" onClick={reload}> Try again </button>)}
                </div>

                {errorMessage && (
                    <div className="flex items-center">{errorMessage}</div>
                )}
                <TokenList tokens={resultTokens} />
            </div>
        </main>
    );
}
