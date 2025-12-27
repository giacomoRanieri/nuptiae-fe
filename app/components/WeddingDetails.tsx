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
        {data.dateBackground && (
          <Image
            src={urlFor(data.dateBackground).width(1240).url()}
            alt="Couple background"
            fill
            className={styles.bgImage}
          />
        )}
        {data.dateImage && (
          <Image
            src={urlFor(data.dateImage).width(715).url()}
            alt="Couple image"
            width={715}
            height={599}
            className={styles.fgImage}
          />
        )}
        <div className={styles.ringsOverlay}>
          <Image src="/WeddingRings.svg" alt="Rings" width={135} height={120} />
        </div>
        <h2 className={styles.saveTheDate}>{t("saveTheDate")}</h2>
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
