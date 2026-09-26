export interface SearchFieldProps {
    value: string;
    onChange: (newQuery: string) => void;
}

export const SearchField = ({value, onChange}: SearchFieldProps) => {
    return (
        <div className="flex flex-col items-center gap-3 px-4">
            <input
                className="bg-amber-400"
                type="text"
                value={value}
                // @ts-ignore
                onInput={(event) => onChange(event.target.value)}/>
        </div>
    );
};