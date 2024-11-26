import Navbar from "@/components/Navbar";

interface Props {
  children?: React.ReactNode
}

export default function PageLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto content-center justify-items-center	">{children}</main>
    </div>
  );
}
