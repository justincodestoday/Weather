import { formatCityTime } from "./formatDateTime";

// 2022-09-10T16:52:00Z
const DT = 1_662_828_720;

describe("formatCityTime", () => {
  it("formats the observation time as '<day> <month>, <h:mm AM/PM>'", () => {
    expect(formatCityTime(DT, 0)).toBe("10 September, 4:52 PM");
  });

  it("applies a positive UTC offset (east of Greenwich)", () => {
    expect(formatCityTime(DT, 3600)).toBe("10 September, 5:52 PM");
    expect(formatCityTime(DT, 28_800)).toBe("11 September, 12:52 AM");
  });

  it("applies a negative UTC offset (west of Greenwich)", () => {
    expect(formatCityTime(DT, -3600)).toBe("10 September, 3:52 PM");
  });

  it("handles the 12-hour boundaries (midnight and noon read as 12)", () => {
    const midnight = Date.UTC(2022, 8, 10, 0, 0, 0) / 1000;
    const noon = Date.UTC(2022, 8, 10, 12, 0, 0) / 1000;
    expect(formatCityTime(midnight, 0)).toBe("10 September, 12:00 AM");
    expect(formatCityTime(noon, 0)).toBe("10 September, 12:00 PM");
  });

  it("does not depend on the machine's timezone (formatted as UTC)", () => {
    expect(formatCityTime(DT, 0)).toBe(formatCityTime(DT, 0));
  });
});
