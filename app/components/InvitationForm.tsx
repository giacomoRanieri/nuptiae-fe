"use client";

import { useActionState, useState } from "react";
import { updateInvitationAction } from "@/app/actions/invitation";
import {
  Age,
  ConfirmationStatus,
  InvitationDto,
  ParticipantDto,
} from "@/lib/graphql/graphql";
import styles from "./InvitationForm.module.css";
import { useTranslations } from "next-intl";

interface Props {
  invitation: InvitationDto;
}

const initialState = {
  message: "",
  success: false,
};

// Empty participant template
const emptyParticipant: Partial<ParticipantDto> = {
  name: "",
  lastName: "",
  age: Age.ADULT,
  intolerances: "",
  celiac: false,
  vegetarian: false,
  vegan: false,
};

export function InvitationForm({ invitation }: Props) {
  const t = useTranslations("InvitationForm");
  const [state, formAction, isPending] = useActionState(
    updateInvitationAction,
    initialState
  );
  const [status, setStatus] = useState<ConfirmationStatus>(
    (invitation.confirmationStatus as ConfirmationStatus) ||
      ConfirmationStatus.PENDING
  );

  // Ensure at least one participant
  const [participants, setParticipants] = useState<Partial<ParticipantDto>[]>(
    invitation.participants && invitation.participants.length > 0
      ? invitation.participants
      : [emptyParticipant]
  );

  // Fix check for re-hydration of age enum or booleans if coming from DB
  // (Assuming invitation.participants came correct from server)

  const addParticipant = () => {
    console.log("Adding participant");
    setParticipants([...participants, emptyParticipant]);
  };

  const removeParticipant = (index: number) => {
    console.log("Removing participant", index);
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={invitation._id} />

      {state.message && (
        <div className={state.success ? styles.success : styles.error}>
          {state.message}
        </div>
      )}

      <div>
        <label>{t("confirmationStatus")}</label>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="radio"
              id="confirmed"
              name="status"
              value={ConfirmationStatus.CONFIRMED}
              checked={status === ConfirmationStatus.CONFIRMED}
              onChange={() => setStatus(ConfirmationStatus.CONFIRMED)}
            />
            <label htmlFor="confirmed" style={{ fontWeight: "normal" }}>
              {t("confirmed")}
            </label>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="radio"
              id="notAttending"
              name="status"
              value={ConfirmationStatus.NOT_ATTENDING}
              checked={status === ConfirmationStatus.NOT_ATTENDING}
              onChange={() => setStatus(ConfirmationStatus.NOT_ATTENDING)}
            />
            <label htmlFor="notAttending" style={{ fontWeight: "normal" }}>
              {t("notAttending")}
            </label>
          </div>
        </div>
      </div>

      {status === ConfirmationStatus.CONFIRMED && (
        <div>
          <div>immagine di felicità</div>
          <h2>
            Siamo felici che hai confermato la partecipazione al nostro
            matrimonio!
          </h2>
          <p>
            Ti chiediamo ancora alcune informazioni per rendere questo giorno
            speciale e accogliente per tutte e tutti!
          </p>
          <div>
            <div>Contatti di riferimento</div>
            <div className={styles.field}>
              <label htmlFor="email">{t("email")}</label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={invitation.email || ""}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phoneNumber">{t("phoneNumber")}</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={invitation.phoneNumber || ""}
                placeholder="+39 123 456 7890"
                required
              />
            </div>
          </div>
          <div>
            <div>
              Ti/vi interessa supporto nel trovare un alloggio per la notte
              dell’11 settembre nelle vicinanze della location? (è a circa 1 ora
              di auto da Torino)
            </div>
            <input
              type="radio"
              id="interestedInAccommodation"
              name="interestedInAccommodation"
              value="true"
              defaultChecked={invitation.isInterestedInAccommodation}
            />
            <label htmlFor="interestedInAccommodation">Sì</label>
            <input
              type="radio"
              id="notInterestedInAccommodation"
              name="interestedInAccommodation"
              value="false"
              defaultChecked={!invitation.isInterestedInAccommodation}
            />
            <label htmlFor="notInterestedInAccommodation">No</label>
          </div>
          <div>
            <h3 style={{ marginTop: "2rem" }}>{t("participantsListTitle")}</h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              {participants.map((participant, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <h4>#{index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "var(--error, #cc0000)",
                          fontSize: "0.8rem",
                          color: "red",
                          border: "1px solid red",
                          borderRadius: "4px",
                        }}
                      >
                        {t("removeParticipant")}
                      </button>
                    )}
                  </div>

                  {participant._id && (
                    <input
                      type="hidden"
                      name={`participants[${index}]._id`}
                      value={participant._id}
                    />
                  )}

                  <div className={styles.field}>
                    <label>{t("name")}</label>
                    <input
                      type="text"
                      name={`participants[${index}].name`}
                      defaultValue={participant.name}
                      required
                      className="w-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>{t("lastName")}</label>
                    <input
                      type="text"
                      name={`participants[${index}].lastName`}
                      defaultValue={participant.lastName}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>{t("age")}</label>
                    <select
                      name={`participants[${index}].age`}
                      defaultValue={participant.age || Age.ADULT}
                    >
                      <option value={Age.ADULT}>{t("adult")}</option>
                      <option value={Age.CHILD}>{t("child")}</option>
                      <option value={Age.INFANT}>{t("infant")}</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label>{t("intolerances")}</label>
                    <textarea
                      name={`participants[${index}].intolerances`}
                      defaultValue={participant.intolerances || ""}
                      style={{
                        minHeight: "60px",
                        borderRadius: "6px",
                        padding: "0.5rem",
                        border: "1px solid rgba(0,0,0,0.1)",
                        width: "100%",
                      }}
                    />
                  </div>

                  <div
                    style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
                  >
                    <div className={styles.field} style={{ flex: 1 }}>
                      <label>
                        <input
                          type="checkbox"
                          name={`participants[${index}].celiac`}
                          checked={participant.celiac}
                        />
                        {t("celiac")}
                      </label>
                    </div>
                    <div className={styles.field} style={{ flex: 1 }}>
                      <label>
                        <input
                          type="checkbox"
                          name={`participants[${index}].vegetarian`}
                          checked={participant.vegetarian}
                        />
                        {t("vegetarian")}
                      </label>
                    </div>
                    <div className={styles.field} style={{ flex: 1 }}>
                      <label>
                        <input
                          type="checkbox"
                          name={`participants[${index}].vegan`}
                          checked={participant.vegan}
                        />
                        {t("vegan")}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                onClick={addParticipant}
                style={{
                  background: "var(--secondary, #333)",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {t("addParticipant")}
              </button>
            </div>
          </div>
        </div>
      )}

      {status === ConfirmationStatus.NOT_ATTENDING && (
        <div>
          <div>immagine di dispiacere</div>
          <h2>
            Ci dispiace che non riuscirai a partecipare. Ci mancherai, ma
            brinderemo sicuramente anche per te!
          </h2>
          <p>
            Se cambi idea puoi inquadrare di nuovo il qr code dell’invito e
            cambiare la tua risposta. Ti preghiamo di farlo entro il 15 Giugno
            2026
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={styles.submitButton}
        style={{ marginTop: "2rem" }}
      >
        {isPending ? t("saving") : t("submit")}
      </button>
    </form>
  );
}
