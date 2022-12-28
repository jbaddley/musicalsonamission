import Link from "next/link";

export function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>Home</li>
          <li>
            <Link href='/productions'>Productions</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
