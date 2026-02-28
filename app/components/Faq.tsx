"use client";

import { useState } from "react";
import { FaqData } from "../../lib/types";
import { Plus, Minus } from "lucide-react";
import styles from "./Faq.module.css";
interface FaqProps {
  data: FaqData;
}

export default function Faq({ data }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Use translations for the default text "Select a question..."
  // const t = useTranslations("Index"); // fallback // Removed as per instruction
  if (!data || !data.faqList) return null;

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const openAnswer = openIndex !== null ? data.faqList[openIndex].answer : null;

  return (
    <section className={styles.faqSection} id="faq">
      <h2 className={styles.title}>{data.title}</h2>
      <div className={styles.content}>
        <div className={styles.listColumn}>
          {data.faqList.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqRow} ${openIndex === index ? styles.active : ""}`}
              onClick={() => toggleQuestion(index)}
            >
              <h3 className={styles.questionTitle}>{faq.question}</h3>
              {openIndex === index ? (
                <div className={styles.iconWrapper}>
                  <Minus size={20} strokeWidth={3} className={styles.icon} />
                </div>
              ) : (
                <div className={styles.iconWrapper}>
                  <Plus size={20} strokeWidth={3} className={styles.icon} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.answerColumn}>
          <div className={styles.answerBox}>
            {openAnswer ? <p>{openAnswer}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
