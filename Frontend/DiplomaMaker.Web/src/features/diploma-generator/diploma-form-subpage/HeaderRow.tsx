export function HeaderRow({ headerTitles }: { headerTitles: string[] }) {
    return (
        <tr>
            {headerTitles.map(title => <th key={title}>{title}</th>)}
        </tr>
    );
}