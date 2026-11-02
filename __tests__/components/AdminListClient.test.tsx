// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as invitationActions from "@/app/actions/invitation";
import { AdminListClient } from "@/app/components/AdminListClient";
import { Age, ConfirmationStatus, InvitationDto } from "@/lib/models/invitation";

const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

vi.mock("@/app/i18n", () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
  useLocale: () => "it",
}));

const sampleInvitations: InvitationDto[] = [
  {
    _id: "inv-b",
    secret: "secret-b",
    recipient: "Famiglia Verdi",
    confirmationStatus: ConfirmationStatus.Pending,
    isInterestedInAccommodation: false,
    participants: [
      {
        _id: "p1",
        name: "Luigi",
        lastName: "Verdi",
        age: Age.Adult,
        intolerances: "",
        celiac: false,
        vegetarian: false,
        vegan: false,
      },
    ],
  },
  {
    _id: "inv-a",
    secret: "secret-a",
    recipient: "Famiglia Bianchi",
    confirmationStatus: ConfirmationStatus.Confirmed,
    isInterestedInAccommodation: true,
    participants: [
      {
        _id: "p2",
        name: "Anna",
        lastName: "Bianchi",
        age: Age.Adult,
        intolerances: "",
        celiac: false,
        vegetarian: false,
        vegan: false,
      },
    ],
  },
];

describe("AdminListClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  it("renders invitations sorted by name by default and filters by search query", () => {
    render(<AdminListClient invitations={sampleInvitations} />);

    expect(screen.getByText("Famiglia Bianchi")).toBeDefined();
    expect(screen.getByText("Famiglia Verdi")).toBeDefined();

    const searchInput = screen.getByPlaceholderText("searchInvitations");
    fireEvent.change(searchInput, { target: { value: "Luigi" } });

    expect(screen.queryByText("Famiglia Bianchi")).toBeNull();
    expect(screen.getByText("Famiglia Verdi")).toBeDefined();
  });

  it("filters by status and accommodation need", () => {
    render(<AdminListClient invitations={sampleInvitations} />);

    const selects = screen.getAllByRole("combobox");
    const statusSelect = selects[0];
    const accommodationSelect = selects[1];

    fireEvent.change(statusSelect, {
      target: { value: ConfirmationStatus.Confirmed },
    });
    expect(screen.getByText("Famiglia Bianchi")).toBeDefined();
    expect(screen.queryByText("Famiglia Verdi")).toBeNull();

    fireEvent.change(statusSelect, { target: { value: "ALL" } });
    fireEvent.change(accommodationSelect, { target: { value: "NO" } });
    expect(screen.queryByText("Famiglia Bianchi")).toBeNull();
    expect(screen.getByText("Famiglia Verdi")).toBeDefined();
  });

  it("opens the Create Invitation modal and submits new recipient", async () => {
    const createSpy = vi
      .spyOn(invitationActions, "createInvitationAction")
      .mockResolvedValue({
        success: true,
        invitation: {
          _id: "inv-new",
          recipient: "Famiglia Nuovi",
          confirmationStatus: ConfirmationStatus.Pending,
          isInterestedInAccommodation: false,
          participants: [],
        },
      });

    render(<AdminListClient invitations={sampleInvitations} />);

    const openBtn = screen.getByRole("button", { name: /createInvitation/i });
    fireEvent.click(openBtn);

    const input = screen.getByPlaceholderText("recipientPlaceholder");
    fireEvent.change(input, { target: { value: "Famiglia Nuovi" } });

    const submitBtn = screen.getByRole("button", { name: "createConfirm" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith("Famiglia Nuovi");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("copies the guest magic link to clipboard when clicking the share button", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<AdminListClient invitations={sampleInvitations} />);

    const shareButtons = screen.getAllByTitle("shareLink");
    fireEvent.click(shareButtons[0]);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        expect.stringContaining("/it/participant/inv-a?token=secret-a")
      );
    });
  });
});
