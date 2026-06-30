import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";

describe("PlaybackControls skip to end", () => {
  it("renders a skip-to-end control when a timeline is available", () => {
    const onTimelineChange = jest.fn();

    render(
      <PlaybackControls
        totalSteps={12}
        currentStep={3}
        onTimelineChange={onTimelineChange}
      />
    );

    const skipButton = screen.getByRole("button", {
      name: /skip to end of visualization/i,
    });

    expect(skipButton).toBeInTheDocument();

    fireEvent.click(skipButton);

    expect(onTimelineChange).toHaveBeenCalledWith(12);
  });
});
