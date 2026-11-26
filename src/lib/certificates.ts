export interface Certificate {
  id: string;
  name: string;
  qualification: string;
  school: string;
  country: string;
  year: string;
}

export type CertificateInput = Omit<Certificate, "id">;
export const STORAGE_KEY = "check-my-certificate-registry-v1";

export const demoCertificates: Certificate[] = [
  { id: "CERT-1001", name: "Amina Yusuf", qualification: "BSc IT", school: "University of Lagos", country: "Nigeria", year: "2020" },
  { id: "CERT-1002", name: "Daniel Otieno", qualification: "Diploma in ICT", school: "Kenya Technical Trainers College", country: "Kenya", year: "2021" },
  { id: "CERT-1003", name: "Priya Sharma", qualification: "Bachelor of Engineering", school: "University of Mumbai", country: "India", year: "2019" },
  { id: "CERT-1004", name: "Grace Mensah", qualification: "Bachelor of Nursing", school: "University of Ghana", country: "Ghana", year: "2022" },
];

export function findCertificate(records: Certificate[], id: string) {
  return records.find((record) => record.id === id.trim().toUpperCase());
}

export function createCertificate(records: Certificate[], input: CertificateInput): Certificate {
  const highest = records.reduce((max, record) => {
    const match = /^CERT-(\d+)$/.exec(record.id);
    return Math.max(max, Number(match?.[1] ?? 1000));
  }, 1000);
  return {
    id: `CERT-${highest + 1}`,
    name: input.name.trim(),
    qualification: input.qualification.trim(),
    school: input.school.trim(),
    country: input.country.trim(),
    year: input.year.trim(),
  };
}

export function readCertificates(): Certificate[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [...demoCertificates];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isCertificate)) {
    throw new Error("The saved certificate registry could not be read.");
  }
  return parsed;
}

function isCertificate(value: unknown): value is Certificate {
  if (!value || typeof value !== "object") return false;
  return ["id", "name", "qualification", "school", "country", "year"].every(
    (key) => key in value && typeof (value as Record<string, unknown>)[key] === "string",
  );
}

export function saveCertificates(records: Certificate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}