"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import styles from "./Countdown.module.css";

interface CountdownProps {
  targetDate: string;
}

export const Countdown = ({ targetDate }: CountdownProps) => {
  const t = useTranslations("Countdown");

  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!timeLeft) return null;

  return (
    <div className={styles.countdown}>
      <div className={styles.item}>
        <span className={styles.number}>{timeLeft.days.toLocaleString()}</span>
        <span className={styles.label}>{t("days")}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.number}>
          {timeLeft.hours.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
          })}
        </span>
        <span className={styles.label}>{t("hours")}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.number}>
          {timeLeft.minutes.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
          })}
        </span>
        <span className={styles.label}>{t("minutes")}</span>
      </div>
    </div>
  );
};
