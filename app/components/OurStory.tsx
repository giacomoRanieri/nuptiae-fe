import styles from './OurStory.module.css';
import { OurStory as OurStoryData } from '../../lib/contentful-models';

interface OurStoryProps {
  data: OurStoryData;
}

const OurStory = ({ data }: OurStoryProps) => {
  return (
    <section className={styles.ourStory}>
      <h2>{data.title}</h2>
      {data.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </section>
  );
};

export default OurStory;
