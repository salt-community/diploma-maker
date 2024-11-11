import { NamedEntity } from "../api/models";

interface Props {
    title: string,
    items: NamedEntity[],
    onClick: (item: NamedEntity) => void
}

export default function Dropdown({ title, items, onClick }: Props) {
    return (
        <>
            <details className="dropdown">
                <summary className="btn m-1">{title}</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    {items.map(item => (
                        <li key={item.guid}>
                            <a
                                onClick={() => onClick(item)}>
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </details>
        </>
    );
}