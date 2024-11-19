import Navbar from "../Navbar";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="h-100 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
