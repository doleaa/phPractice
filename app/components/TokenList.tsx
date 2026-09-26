import type {DisplayToken} from "~/types/tokens";

export interface TokenListProps {
    tokens: DisplayToken[];
}

export const TokenList = ({tokens}: TokenListProps) => {
    return (
        <div className="max-w-[760px] w-full flex flex-col space-y-12 px-4">
            {tokens.map((token: DisplayToken) => (
                <dl className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 flex flex-wrap gap-6">
                    <div className="flex-1 flex items-center justify-center max-w-[100px]">
                        <img className="size-8" src={token.logoUrl}/>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <dt title={token.name} className="font-medium max-w-[100px] overflow-auto text-gray-900 dark:text-gray-100">
                            {token.name}
                        </dt>
                        <dt className="font-light text-gray-900 dark:text-gray-100">
                            {token.symbol}
                        </dt>
                    </div>
                    <div className="flex-1">
                        <dt className="font-medium text-gray-900 dark:text-gray-100">
                            {token.marketCapRank}
                        </dt>
                    </div>
                    <div className="flex-1">
                        <dt className="font-medium text-gray-900 dark:text-gray-100">
                            {token.currentPrice ?? '--'}
                        </dt>
                    </div>
                    <div className="flex-1">
                        <dt className={`font-medium ${token.lastDayPriceChangePercentage ? token.lastDayPriceChangePercentage > 0 ? 'text-green-500 dark:text-green-300' : 'text-red-500 dark:text-red-300': ''}`}>
                            {token.lastDayPriceChangePercentage ?? '--'}
                        </dt>
                    </div>
                </dl>
            ))}
        </div>
    );
};