import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <p>Loading content...</p>
    </div>
  );
}