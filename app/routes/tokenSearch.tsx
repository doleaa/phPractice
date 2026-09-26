import {SearchField} from "~/components/SearchField";
import {TokenList} from "~/components/TokenList";
import {useTokenSearch} from "~/hooks/use-token-search";

export default function TokenSearch() {
    const {
        query,
        setQuery,
        resultTokens,
        errorMessage,
    } = useTokenSearch();

    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-9 min-h-0">
                <SearchField value={query} onChange={setQuery} />

                {errorMessage && (
                    <div className="flex items-center">{errorMessage}</div>
                )}
                <TokenList tokens={resultTokens} />
            </div>
        </main>
    );
}
