import styles from "./layout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Panel</h1>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
