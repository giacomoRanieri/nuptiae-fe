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
import Image from "next/image";
import { Trash } from "lucide-react";
import { ParticipantPageData } from "@/lib/types";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "next-sanity";

interface Props {
  invitation: InvitationDto;
  pageData?: ParticipantPageData["form"];
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

export function InvitationForm({ invitation, pageData }: Props) {
  const t = useTranslations("InvitationForm");
  const [state, formAction, isPending] = useActionState(
    updateInvitationAction,
    initialState,
  );
  const [status, setStatus] = useState<ConfirmationStatus>(
    (invitation.confirmationStatus as ConfirmationStatus) ||
      ConfirmationStatus.PENDING,
  );

  // Ensure at least one participant
  const [participants, setParticipants] = useState<Partial<ParticipantDto>[]>(
    invitation.participants && invitation.participants.length > 0
      ? invitation.participants
      : [emptyParticipant],
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

      <div className={styles.blockLine} style={{ padding: "2rem 1rem" }}>
        <label className={styles.labelBold}>{t("confirmationStatus")}</label>
        <div className={styles.radioBtn}>
          <input
            type="radio"
            id="confirmed"
            name="status"
            value={ConfirmationStatus.CONFIRMED}
            checked={status === ConfirmationStatus.CONFIRMED}
            onChange={() => setStatus(ConfirmationStatus.CONFIRMED)}
          />
          <label htmlFor="confirmed" style={{ fontWeight: "normal" }}>
            {t("yes")}
          </label>
        </div>
        <div className={styles.radioBtn}>
          <input
            type="radio"
            id="notAttending"
            name="status"
            value={ConfirmationStatus.NOT_ATTENDING}
            checked={status === ConfirmationStatus.NOT_ATTENDING}
            onChange={() => setStatus(ConfirmationStatus.NOT_ATTENDING)}
          />
          <label htmlFor="notAttending" style={{ fontWeight: "normal" }}>
            {t("no")}
          </label>
        </div>
      </div>

      {status === ConfirmationStatus.CONFIRMED && (
        <div>
          <div className={styles.responseBlock}>
            <div className={styles.responseImg}>
              {pageData?.willAttend?.image && (
                <Image
                  src={urlFor(pageData.willAttend.image).url()}
                  alt="Immagine felice"
                  width={156}
                  height={156}
                />
              )}
            </div>
            <div>
              <h2 className={styles.titleOrange}>
                {pageData?.willAttend?.title}
              </h2>
              <div className={styles.description}>
                {pageData?.willAttend?.description ? (
                  <PortableText value={pageData.willAttend.description} />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className={styles.contentForm}>
            <h3>Contatti di riferimento</h3>
            <div className={styles.wrapper}>
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
            <div className={styles.my3}>
              <h4>{pageData?.willAttend?.needAccommodationTitle}</h4>
              <div className={styles.description}>
                {pageData?.willAttend?.needAccommodationDescription ? (
                  <PortableText
                    value={pageData.willAttend.needAccommodationDescription}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div>
              <div className={styles.radioBtn}>
                <input
                  type="radio"
                  id="interestedInAccommodation"
                  name="interestedInAccommodation"
                  value="true"
                  defaultChecked={invitation.isInterestedInAccommodation}
                />
                <label htmlFor="interestedInAccommodation">{t("yes")}</label>
              </div>
              <div className={styles.radioBtn}>
                <input
                  type="radio"
                  id="notInterestedInAccommodation"
                  name="interestedInAccommodation"
                  value="false"
                  defaultChecked={!invitation.isInterestedInAccommodation}
                />
                <label htmlFor="notInterestedInAccommodation">{t("no")}</label>
              </div>
            </div>
            <div className={styles.partecipantBlock}>
              <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                {t("participantsListTitle")}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                {participants.map((participant, index) => (
                  <div key={index} className={styles.wrapperMain}>
                    <div className={styles.numBtnGroup}>
                      <h4>{index + 1}</h4>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                        >
                          <Trash width={26} height={26} />
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
                    <div className={styles.wrapper}>
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
                          rows={3}
                          name={`participants[${index}].intolerances`}
                          defaultValue={participant.intolerances || ""}
                        />
                      </div>

                      <div className={styles.checkGroup}>
                        <div className={styles.field} style={{ flex: 1 }}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name={`participants[${index}].celiac`}
                              checked={participant.celiac}
                            />
                            {t("celiac")}
                          </label>
                        </div>
                        <div className={styles.field} style={{ flex: 1 }}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name={`participants[${index}].vegetarian`}
                              checked={participant.vegetarian}
                            />
                            {t("vegetarian")}
                          </label>
                        </div>
                        <div className={styles.field} style={{ flex: 1 }}>
                          <label className={styles.checkboxLabel}>
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
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  type="button"
                  onClick={addParticipant}
                  className={styles.addPartecipantBtn}
                >
                  + {t("addParticipant")}
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className={styles.submitButton}
                >
                  {isPending ? t("saving") : t("submit")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === ConfirmationStatus.NOT_ATTENDING && (
        <div className={styles.responseBlock}>
          <div className={styles.responseImg}>
            {pageData?.willNotAttend?.image && (
              <Image
                src={urlFor(pageData.willNotAttend.image).url()}
                alt="Immagine triste"
                width={156}
                height={156}
              />
            )}
          </div>
          <div>
            <h2 className={styles.titleOrange}>
              {pageData?.willNotAttend?.title}
            </h2>
            <div className={styles.description}>
              {pageData?.willNotAttend?.description ? (
                <PortableText value={pageData.willNotAttend.description} />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
