import Image from "next/image";
import styles from "./page.module.css";
import Generate from "./generate/page";

export default function Home() {

  return (
      <div className="center">
          <Generate />
      </div>
  );
}
