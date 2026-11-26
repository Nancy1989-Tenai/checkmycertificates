import { beforeEach, describe, expect, it } from "vitest";
import { createCertificate, demoCertificates, findCertificate, readCertificates, saveCertificates } from "@/lib/certificates";

describe("Certificate registry", () => {
  beforeEach(() => localStorage.clear());

  it("finds CERT-1001 with Amina Yusuf's qualification", () => {
    expect(findCertificate(demoCertificates, "CERT-1001")).toMatchObject({ name: "Amina Yusuf", qualification: "BSc IT", school: "University of Lagos", country: "Nigeria", year: "2020" });
  });

  it("returns no certificate for an ID that does not exist", () => {
    expect(findCertificate(demoCertificates, "CERT-9999")).toBeUndefined();
  });

  it("starts an empty registry at CERT-1001", () => {
    const sample = demoCertificates[0];
    if (!sample) throw new Error("Missing demo record");
    expect(createCertificate([], sample).id).toBe("CERT-1001");
  });

  it("persists a new certificate and reads it back by its unique ID", () => {
    const record = createCertificate(demoCertificates, { name: "Nancy Tenai", qualification: "Diploma in ICT", school: "Nairobi Technical College", country: "Kenya", year: "2024" });
    expect(record.id).toBe("CERT-1005");
    saveCertificates([...demoCertificates, record]);
    expect(findCertificate(readCertificates(), " cert-1005 ")).toEqual(record);
  });
});