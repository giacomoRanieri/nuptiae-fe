import { EventDetails } from "../../lib/types";
import Image from "next/image";
import { urlFor } from "../../lib/sanity";
import styles from "./WeddingDetails.module.css";
import { Calendar, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface WeddingDetailsProps {
  data: EventDetails;
}

export default function WeddingDetails({ data }: WeddingDetailsProps) {
  const t = useTranslations("WeddingDetails");

  if (!data) return null;

  return (
    <section className={styles.detailsSection} id="details">
      {/* Date Card */}
      <div className={styles.dateCard}>
        <div className={styles.dateContent}>
          <div className={styles.ringsOverlay}>
            <Image src="/WeddingRings.svg" alt="Rings" width={80} height={60} />
          </div>
          <h2 className={styles.saveTheDate}>
            {t.rich("saveTheDate", {
              br: () => <br />,
            })}
          </h2>
          {data.date && (
            <div className={styles.dateBadge}>
              {new Date(data.date).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}
        </div>
        {data.dateBackground && (
          <Image
            src={urlFor(data.dateBackground).width(800).url()}
            alt="Couple background"
            fill
            className={styles.bgImage}
          />
        )}
        {data.dateImage && (
          <Image
            src={urlFor(data.dateImage).width(800).url()}
            alt="Couple image"
            fill
            className={styles.dateImage}
          />
        )}
      </div>

      {/* Location Card */}
      <div className={styles.locationContainer}>
        <div className={styles.locationImageWrapper}>
          {data.locationImage && (
            <Image
              src={urlFor(data.locationImage).width(600).url()}
              alt="Location"
              width={500}
              height={400}
              className={styles.locationImg}
            />
          )}
        </div>
        <div className={styles.locationInfo}>
          <div className={styles.locationBadge}>{data.locationName}</div>
          <div className={styles.addressRow}>
            <MapPin size={45} />
            <span>{data.address}</span>
          </div>
          <div className={styles.buttons}>
            <button className={styles.actionBtn}>
              <Calendar size={32} /> {t("openMaps")}
            </button>
            <button className={styles.actionBtnOutline}>
              <Calendar size={32} /> {t("saveCalendar")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
