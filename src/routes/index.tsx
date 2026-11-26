import { createFileRoute } from "@tanstack/react-router";
import { CertificateWorkspace } from "@/components/certificate-workspace";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Add my certificate | Check My Certificate" },
    { name: "description", content: "Register your qualification and get a unique Certificate ID to share with an employer in the Check My Certificate demo." },
    { property: "og:title", content: "Add my certificate | Check My Certificate" },
    { property: "og:description", content: "Bring your qualifications with you. Register your certificate and take the next step." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <CertificateWorkspace mode="add" />,
});
