import { Link } from "react-router-dom";

export function Home() {
  return (
    <ul>
      <li>
        <Link to="/create">"Create Offer" widget page</Link>
      </li>
      <li>
        <Link to="/commit">"Create to Offer" widget page</Link>
      </li>
    </ul>
  );
}
