// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExportButton } from "@/app/components/ExportButton";
import { Age, ConfirmationStatus, InvitationDto } from "@/lib/models/invitation";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("ExportButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders export button and triggers UTF-8 BOM CSV download on click", () => {
    const createObjectURL = vi.fn(() => "blob:http://localhost/csv");
    const revokeObjectURL = vi.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    const invitations: InvitationDto[] = [
      {
        _id: "inv1",
        recipient: "Famiglia Rossi",
        confirmationStatus: ConfirmationStatus.Confirmed,
        isInterestedInAccommodation: true,
        participants: [
          {
            _id: "p1",
            name: "Mario",
            lastName: "Rossi",
            age: Age.Adult,
            celiac: true,
            vegetarian: false,
            vegan: false,
            intolerances: "Lactose",
          },
        ],
      },
    ];

    render(<ExportButton invitations={invitations} />);
    const btn = screen.getByRole("button", { name: "export" });
    fireEvent.click(btn);

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blobArg = (createObjectURL.mock.calls[0] as unknown as [Blob])[0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe("text/csv;charset=utf-8;");
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
