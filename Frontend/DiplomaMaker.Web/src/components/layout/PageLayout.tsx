import Navbar from "@/components/Navbar";

interface Props {
  children?: React.ReactNode
}

export default function PageLayout({ children }: Props) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="h-100 flex-1 overflow-auto content-center justify-items-center	">{children}</main>
    </div>
  );
}
