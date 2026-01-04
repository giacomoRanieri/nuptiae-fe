import { HeroData } from "../../lib/types";
import Image from "next/image";
import { urlFor } from "../../lib/sanity";
import styles from "./Hero.module.css";
import { useTranslations } from "next-intl";

interface HeroProps {
  data: HeroData;
}

export default function Hero({ data }: HeroProps) {
  const t = useTranslations("Hero");
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
            <h2 className={styles.namesBadge}>
              {coupleNames || t("fallbackNames")}
            </h2>
          </div>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.textColumn}>
            <h1 className={styles.mainTitle}>{headline}</h1>
          </div>
          <div className={styles.imageColumn}>
            {heroImage && (
              <div className={styles.imageWrapper}>
                <Image
                  src={urlFor(heroImage).width(600).url()}
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
          <div>
            <Image src="/RingsHeart.svg" alt="Rings" fill/>
          </div>
        </div>
        <div className={styles.blueIcon}>
          <div>
            <Image src="/Castle.svg" alt="Castle" fill/>
          </div>
        </div>
        <div className={styles.orangeIcon}>
          <div>
            <Image src="/Glasses.svg" alt="Cheers" fill/>
          </div>
        </div>
      </div>
    </section>
  );
}
