import Image from "next/image";
import CanvasComponent from "./components/CanvasComponent";
import styles from "./styles/Canvas.module.css";
export default function Main() {
  return (
    <main>
      <div className={styles.navbar}>
        <Image src="/logo.png" alt="logo" width={50} height={50} />
        <p>INTERACTIVE CANVAS APP</p>
      </div>
      <CanvasComponent />
    </main>
  );
}
