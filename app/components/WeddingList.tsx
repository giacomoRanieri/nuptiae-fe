"use client";

import Image from "next/image";
import { urlFor } from "../../lib/sanity";
import { WeddingListData } from "../../lib/types";
import styles from "./WeddingList.module.css";
import { PortableText } from "next-sanity";

interface WeddingListProps {
  data: WeddingListData;
}

export default function WeddingList({ data }: WeddingListProps) {
  if (!data) return null;

  const {
    title,
    description,
    image,
    actionType,
    actionText,
    actionUrl,
    actionMethod,
  } = data;

  const goToWeddingList = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action =
      "https://www.imieieventi.com//invitati/login.php?codAgency=721&network=46";
    form.target = "_blank"; // La chiave per aprire in una nuova scheda

    // Aggiungi eventuali parametri
    const userInput = document.createElement("input");
    userInput.type = "hidden";
    userInput.name = "username";
    userInput.value = "LoredanaGiacomo";
    form.appendChild(userInput);
    const pwdInput = document.createElement("input");
    pwdInput.type = "hidden";
    pwdInput.name = "password";
    pwdInput.value = "14Sep2026";
    form.appendChild(pwdInput);

    // Lo aggiungi al body, lo invii e lo rimuovi
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const localActions: Record<string, () => void> = {
    goToWeddingList,
  };

  const handleActionClick = () => {
    if (actionType === "link" && actionUrl) {
      window.open(actionUrl, "_blank");
    } else if (actionType === "action" && actionMethod) {
      if (localActions[actionMethod]) {
        localActions[actionMethod]();
      } else if (typeof window !== "undefined") {
        const method = (window as unknown as Record<string, unknown>)[
          actionMethod
        ];
        if (typeof method === "function") {
          (method as () => void)(); // Cast to a function type before calling
        } else {
          console.warn(
            `Action method ${actionMethod} not found on localActions or window object.`,
          );
        }
      }
    }
  };

  return (
    <section className={styles.weddingList} id="wedding-list">
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <div className={styles.description}>
            <PortableText value={description} />
          </div>
          {(actionType === "link" || actionType === "action") && actionText && (
            <button className={styles.ctaButton} onClick={handleActionClick}>
              {actionText}
            </button>
          )}
        </div>
        <div className={styles.centerColumn}>
          <div className={styles.imageWrapper}>
            {image && (
              <Image
                src={urlFor(image).url()}
                alt={title}
                fill
                className={styles.mainImage}
              />
            )}
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.iconWrapper}>
            <div>
              <Image fill src="/presents.svg" alt="Presents" />
            </div>
          </div>
          <div className={styles.iconWrapper}>
            <div>
              <Image fill src="/tickets.svg" alt="Tickets" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
