import { isValidCountryCode, normaliseCountryCode } from "./country";

describe("normaliseCountryCode", () => {
  it("uppercases the input", () => {
    expect(normaliseCountryCode("my")).toBe("MY");
  });

  it("strips whitespace, digits and punctuation", () => {
    expect(normaliseCountryCode(" gb ")).toBe("GB");
    expect(normaliseCountryCode("u.s.a")).toBe("US");
    expect(normaliseCountryCode("k1r2")).toBe("KR");
  });

  it("keeps at most the first two letters", () => {
    expect(normaliseCountryCode("USA")).toBe("US");
    expect(normaliseCountryCode("Malaysia")).toBe("MA");
  });

  it("returns an empty string when nothing usable remains", () => {
    expect(normaliseCountryCode("123")).toBe("");
    expect(normaliseCountryCode("")).toBe("");
  });
});

describe("isValidCountryCode", () => {
  it("accepts assigned ISO 3166-1 alpha-2 codes", () => {
    expect(isValidCountryCode("MY")).toBe(true);
    expect(isValidCountryCode("GB")).toBe(true);
    expect(isValidCountryCode("JP")).toBe(true);
  });

  it("rejects unassigned or malformed codes", () => {
    expect(isValidCountryCode("ZZ")).toBe(false);
    expect(isValidCountryCode("XX")).toBe(false);
    expect(isValidCountryCode("")).toBe(false);
  });

  it("is case-sensitive — it expects an already-normalised code", () => {
    expect(isValidCountryCode("my")).toBe(false);
  });
});
