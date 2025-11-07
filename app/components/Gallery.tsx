import styles from './Gallery.module.css';
import { Gallery as GalleryData } from '../../lib/contentful-models';

interface GalleryProps {
  data: GalleryData;
}

const Gallery = ({ data }: GalleryProps) => {
  return (
    <section className={styles.gallery}>
      <h2>{data.title}</h2>
      <div className={styles.grid}>
        {data.images.map((image) => (
          <img key={image.url} src={image.url} alt="Gallery image" />
        ))}
      </div>
    </section>
  );
};

export default Gallery;
