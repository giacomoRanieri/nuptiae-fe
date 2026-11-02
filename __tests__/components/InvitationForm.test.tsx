// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as invitationActions from "@/app/actions/invitation";
import { InvitationForm } from "@/app/components/InvitationForm";
import { Age, ConfirmationStatus, InvitationDto } from "@/lib/models/invitation";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/lib/sanity/sanity", () => ({
  urlFor: () => ({ url: () => "https://cdn.sanity.io/test.png" }),
}));

const sampleInvitation: InvitationDto = {
  _id: "inv-123",
  recipient: "Famiglia Rossi",
  confirmationStatus: ConfirmationStatus.Confirmed,
  email: "mario@rossi.it",
  phoneNumber: "+39333112233",
  isInterestedInAccommodation: false,
  participants: [
    {
      _id: "p-1",
      name: "Mario",
      lastName: "Rossi",
      age: Age.Adult,
      intolerances: "",
      celiac: false,
      vegetarian: false,
      vegan: false,
    },
  ],
};

describe("InvitationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders participant fields when status is Confirmed and allows adding/removing participants", () => {
    render(<InvitationForm invitation={sampleInvitation} />);

    expect(screen.getByDisplayValue("mario@rossi.it")).toBeDefined();
    expect(screen.getByDisplayValue("Mario")).toBeDefined();
    expect(screen.getByDisplayValue("Rossi")).toBeDefined();

    const addBtn = screen.getByRole("button", { name: /addParticipant/i });
    fireEvent.click(addBtn);

    expect(screen.getByText("2")).toBeDefined();
  });

  it("triggers updateInvitationAction immediately when selecting Not Attending", () => {
    const updateSpy = vi
      .spyOn(invitationActions, "updateInvitationAction")
      .mockResolvedValue({
        success: true,
        message: "update.success",
        timestamp: Date.now(),
      });

    render(<InvitationForm invitation={sampleInvitation} />);

    const notAttendingRadio = document.getElementById(
      "notAttending"
    ) as HTMLInputElement;
    fireEvent.click(notAttendingRadio);

    expect(updateSpy).toHaveBeenCalled();
  });
});
