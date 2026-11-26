import { createFileRoute } from "@tanstack/react-router";
import { CertificateWorkspace } from "@/components/certificate-workspace";

export const Route = createFileRoute("/verify")({
  validateSearch: (search: Record<string, unknown>) => ({ id: typeof search['id'] === "string" ? search['id'] : "" }),
  head: () => ({ meta: [
    { title: "Verify a certificate | Check My Certificate" },
    { name: "description", content: "Look up a Certificate ID and review the matching qualification details in the Check My Certificate demo registry." },
    { property: "og:title", content: "Verify a certificate | Check My Certificate" },
    { property: "og:description", content: "Find the person behind the qualification. Check a certificate in seconds." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: VerifyPage,
});

function VerifyPage() {
  const { id } = Route.useSearch();
  return <CertificateWorkspace mode="verify" initialId={id || "CERT-1001"} />;
}
