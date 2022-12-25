interface BodyProps {
  children: React.ReactNode;
}

export function Body({ children }: BodyProps) {
  return <div className='content'>{children}</div>;
}
