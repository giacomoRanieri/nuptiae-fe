import { HeroData } from '../../lib/types';
import Image from 'next/image';
import { urlFor } from '../../lib/sanity';
import styles from './Hero.module.css';


interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  if (!data) return null;

  const { coupleNames, headline, heroImage } = data;

  return (
    <section className={styles.hero} id="welcome">
      <div className={styles.leftContainer}>
        <div className={styles.topContainer}>
          <div className={styles.logoAndNames}>
              <div className={styles.dinos}>
                  <Image src="/Dino.svg" alt="Dino" fill />
              </div>
              <div className={styles.namesBadge}>
                  {coupleNames || "Loredana & Giacomo"}
              </div>
          </div>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.textColumn}>
            <h1 className={styles.mainTitle}>
              {headline}
            </h1>
          </div>
          <div className={styles.imageColumn}>
            {heroImage && (
              <div className={styles.imageWrapper}>
                  <Image
                    src={urlFor(heroImage).width(295).url()}
                    alt="Couple"
                    width={295}
                    height={456}
                    className={styles.heroImg}
                  />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.ringsIcon}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image src="/RingsHeart.svg" alt="Rings" fill/>
          </div>
        </div>
        <div className={styles.blueIcon}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image src="/Castle.svg" alt="Castle" fill/>
          </div>
        </div>
        <div className={styles.orangeIcon}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image src="/Glasses.svg" alt="Cheers" fill/>
          </div>
        </div>
      </div>
    </section>
  );
}
