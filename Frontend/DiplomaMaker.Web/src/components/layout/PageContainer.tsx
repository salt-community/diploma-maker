export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="prose mx-auto max-w-screen-lg px-6 pb-12 pt-24">
      {children}
    </div>
  );
}
