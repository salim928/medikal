import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "@/components/appointments/BookingForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("BookingForm", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it("renders booking form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BookingForm providerId="test-id" providerName="Smith" />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason for visit/i)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <BookingForm providerId="test-id" providerName="Smith" />
      </QueryClientProvider>
    );

    const submitButton = screen.getByRole("button", { name: /book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please describe/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <BookingForm 
          providerId="test-id" 
          providerName="Smith" 
          onSuccess={onSuccess}
        />
      </QueryClientProvider>
    );

    const dateInput = screen.getByLabelText(/preferred date/i) as HTMLInputElement;
    const reasonInput = screen.getByLabelText(/reason for visit/i) as HTMLTextAreaElement;

    await user.type(dateInput, "2025-12-01T10:00");
    await user.type(reasonInput, "I have been experiencing persistent headaches for the past week");

    const submitButton = screen.getByRole("button", { name: /book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});