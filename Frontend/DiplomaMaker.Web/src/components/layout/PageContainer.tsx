type Props = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PageContainer({ className, children }: Props) {
  return (
    <div
      className={`mx-auto w-full max-w-screen-lg px-6 pb-12 pt-24 ${className}`}
    >
      {children}
    </div>
  );
}
