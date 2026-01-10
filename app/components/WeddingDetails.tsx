"use client";

import { EventDetails } from "../../lib/types";
import Image from "next/image";
import { urlFor } from "../../lib/sanity";
import styles from "./WeddingDetails.module.css";
import { Calendar, Map, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface WeddingDetailsProps {
  data: EventDetails;
}

export default function WeddingDetails({ data }: WeddingDetailsProps) {
  const t = useTranslations("WeddingDetails");

  if (!data) return null;

  const handleOpenMaps = () => {
    if (data.locationMaps) {
      window.open(data.locationMaps, "_blank");
    }
  };

  const handleSaveCalendar = () => {
    if (!data.date) return;

    const eventDate = new Date(data.date);

    // Format date for ICS (YYYYMMDDTHHmmssZ)
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    // Create end date (assume 10 hours later for a wedding)
    const endDate = new Date(eventDate.getTime() + 10 * 60 * 60 * 1000);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nuptiae//Wedding Event//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@nuptiae.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(eventDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${data.calendarName}`,
      `DESCRIPTION:${data.calendarName}`,
      `LOCATION:${data.address}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "wedding-save-the-date.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <p className={styles.dateBadge}>
            {new Date(data.date).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
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
          <p className={styles.locationBadge}>{data.locationName}</p>
          <div className={styles.addressRow}>
            <MapPin size={45} />
            <span>{data.address}</span>
          </div>
          <div className={styles.buttons}>
            <button className={styles.actionBtn} onClick={handleOpenMaps}>
              <Map size={32} /> {t("openMaps")}
            </button>
            <button
              className={styles.actionBtnOutline}
              onClick={handleSaveCalendar}
            >
              <Calendar size={32} /> {t("saveCalendar")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
