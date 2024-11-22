import Navbar from "../Navbar";

interface Props {
  children?: React.ReactNode
}

export default function PageLayout({ children }: Props) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="h-100 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
