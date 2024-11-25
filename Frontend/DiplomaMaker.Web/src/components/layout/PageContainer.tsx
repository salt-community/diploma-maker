interface Props {
  children?: React.ReactNode
}

export default function PageContainer({ children }: Props) {
  return (
    <div className="prose mx-auto max-w-screen-lg px-6 pb-12 pt-24">
      {children}
    </div>
  );
}
