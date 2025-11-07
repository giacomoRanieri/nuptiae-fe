import styles from './WeddingDetails.module.css';
import { WeddingDetails as WeddingDetailsData } from '../../lib/contentful-models';

interface WeddingDetailsProps {
  data: WeddingDetailsData;
}

const WeddingDetails = ({ data }: WeddingDetailsProps) => {
  return (
    <section className={styles.weddingDetails}>
      <h2>{data.title}</h2>
      <div className={styles.details}>
        {data.details.map((detail) => (
          <div key={detail.title}>
            <h3>{detail.title}</h3>
            <p>{detail.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeddingDetails;
