import styles from './Hero.module.css';
import { Hero as HeroData } from '../../lib/contentful-models';

interface HeroProps {
  data: HeroData;
}

const Hero = ({ data }: HeroProps) => {
  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${data.backgroundImage.url})` }}
    >
      <h1>{data.title}</h1>
      <h2>{data.subtitle}</h2>
    </section>
  );
};

export default Hero;
