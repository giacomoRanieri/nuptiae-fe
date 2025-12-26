import { TimelineItem } from '../../lib/types';
import Image from 'next/image';
import { urlFor } from '../../lib/sanity';
import styles from './OurStory.module.css';

interface OurStoryProps {
  data: TimelineItem[];
}

export default function OurStory({ data }: OurStoryProps) {
  if (!data || data.length === 0) return null;

  return (
    <section className={styles.storySection} id="story">
      {data.map((moment: TimelineItem, index: number) => {
        const isRight = moment.imageSide === 'right';
        return (
            <div key={index} className={`${styles.moment} ${isRight ? styles.right : styles.left}`}>
                <div className={styles.imageCol}>
                    {moment.image && (
                        <div className={styles.imageWrapper}>
                             <Image
                                src={urlFor(moment.image).width(400).url()}
                                alt={moment.title}
                                width={400}
                                height={483}
                                className={styles.momentImage}
                             />
                        </div>
                    )}
                </div>
                <div className={styles.textCol}>
                    <h2 className={styles.momentTitle}>{moment.title}</h2>
                    <p className={styles.momentDesc}>{moment.description}</p>
                </div>
            </div>
        )
      })}
    </section>
  );
}
