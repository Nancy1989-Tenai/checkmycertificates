import { Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, BadgeCheck, Check, CheckCheck, ChevronRight, CircleCheck, Copy, FileCheck2, FilePlus2, Globe2, GraduationCap, Info, LockKeyhole, RotateCcw, Search, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import communityImage from "@/assets/certificate-community.asset.json";
import { createCertificate, demoCertificates, findCertificate, readCertificates, saveCertificates, type Certificate, type CertificateInput } from "@/lib/certificates";

const example: CertificateInput = { name: "Amina Yusuf", qualification: "BSc IT", school: "University of Lagos", country: "Nigeria", year: "2020" };

export function CertificateWorkspace({ mode, initialId = "CERT-1001" }: { mode: "add" | "verify"; initialId?: string }) {
  const [records, setRecords] = useState<Certificate[]>(demoCertificates);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CertificateInput>(example);
  const [created, setCreated] = useState<Certificate | null>(null);
  const [certificateId, setCertificateId] = useState(initialId);
  const [result, setResult] = useState<Certificate | null | undefined>(undefined);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    try {
      const saved = readCertificates();
      saveCertificates(saved);
      setRecords(saved);
      setReady(true);
    } catch {
      setError("Browser storage is unavailable. Allow local storage in this browser to save and verify certificates.");
    }
  }, []);

  useEffect(() => {
    setCertificateId(initialId);
    setResult(undefined);
  }, [initialId]);

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    if (Object.values(form).some((value) => !value.trim())) {
      setError("Please complete every certificate detail.");
      return;
    }
    try {
      const current = readCertificates();
      const record = createCertificate(current, form);
      const updated = [...current, record];
      saveCertificates(updated);
      setRecords(updated);
      setCreated(record);
      setError("");
    } catch {
      setError("Your certificate could not be saved. Check that browser storage is allowed and try again.");
    }
  }

  function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    try {
      const current = readCertificates();
      setRecords(current);
      setResult(findCertificate(current, certificateId) ?? null);
      setError("");
    } catch {
      setError("The registry could not be read. Check that browser storage is allowed and try again.");
    }
  }

  async function copyId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopied("Certificate ID copied");
    } catch {
      setCopied("Select the certificate ID to copy it");
    }
  }

  const isAdd = mode === "add";
  const displayRecords = [...records].reverse().slice(0, 4);
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Check My Certificate home"><span className="brand-mark"><ShieldCheck /></span><span>Check My Certificate<span className="text-primary">.</span></span></Link>
          <nav className="header-nav" aria-label="Main navigation">
            <Link to="/" className={`header-link ${isAdd ? "active" : ""}`} aria-current={isAdd ? "page" : undefined}>Add my certificate</Link>
            <Link to="/verify" search={{ id: "" }} className={`header-link ${!isAdd ? "active" : ""}`} aria-current={!isAdd ? "page" : undefined}>Verify a certificate</Link>
          </nav>
          <span className="demo-label" title="Demo records are saved only in this browser"><span className="demo-dot" />Local demo</span>
        </div>
      </header>

      <main className="workspace">
        <div className="breadcrumb"><Globe2 /><span>Certificate workspace</span><ChevronRight /><span className="text-foreground">{isAdd ? "Register" : "Verify"}</span></div>
        <div className="intro">
          <div><div className="eyebrow">{isAdd ? "Your skills. More possibilities." : "A little certainty goes a long way."}</div><h1>{isAdd ? "Add my certificate" : "Verify a certificate"}</h1><p>{isAdd ? "Bring your qualifications with you. Register your certificate and take the next step." : "Find the person behind the qualification. Check a certificate in seconds."}</p></div>
          <div className="intro-emblem">{isAdd ? <GraduationCap /> : <ShieldCheck />}</div>
        </div>

        <div className="main-grid">
          <section className="form-panel" aria-label={isAdd ? "Register a certificate" : "Certificate verification"}>
            <nav className="mode-tabs" aria-label="Certificate pages">
              <Link to="/" className={`mode-tab ${isAdd ? "active" : ""}`} aria-current={isAdd ? "page" : undefined}><FilePlus2 />Add my certificate</Link>
              <Link to="/verify" search={{ id: "" }} className={`mode-tab ${!isAdd ? "active" : ""}`} aria-current={!isAdd ? "page" : undefined}><ShieldCheck />Verify a certificate</Link>
            </nav>
            <div className="panel-body">
              {error && <p className="error-message" role="alert">{error}</p>}
              {isAdd ? created ? (
                <div className="success-view" role="status">
                  <div className="result-icon"><CircleCheck /></div>
                  <div className="eyebrow">One step closer</div>
                  <h2>Your certificate is registered.</h2>
                  <p>{created.name}, your qualification now has a home.<br />Keep this ID to share with an employer.</p>
                  <div className="certificate-id-display"><strong>{created.id}</strong><Button variant="ghost" size="icon" aria-label="Copy certificate ID" title="Copy certificate ID" onClick={() => copyId(created.id)}>{copied === "Certificate ID copied" ? <CheckCheck /> : <Copy />}</Button></div>
                  <div className="copy-note" aria-live="polite">{copied}</div>
                  <div className="success-actions">
                    <Button asChild className="submit-button"><Link to="/verify" search={{ id: created.id }}>Verify this certificate<ArrowRight /></Link></Button>
                    <Button variant="ghost" className="example-button" onClick={() => { setCreated(null); setCopied(""); setForm({ name: "", qualification: "", school: "", country: "", year: "" }); }}><FilePlus2 />Add another certificate</Button>
                  </div>
                  <p className="result-disclaimer">Saved in this browser’s demo registry.</p>
                </div>
              ) : (
                <>
                  <div className="panel-title"><div><h2>Your certificate details</h2><p>Every qualification has a story. Start with yours.</p></div><span className="small-icon"><FileCheck2 /></span></div>
                  <form className="certificate-form" onSubmit={register}>
                    <Field label="Full name" name="name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} wide autoComplete="name" />
                    <Field label="Qualification" name="qualification" value={form.qualification} onChange={(value) => setForm({ ...form, qualification: value })} wide note="The qualification exactly as it appears on your certificate." />
                    <Field label="School or university" name="school" value={form.school} onChange={(value) => setForm({ ...form, school: value })} wide />
                    <Field label="Country" name="country" value={form.country} onChange={(value) => setForm({ ...form, country: value })} />
                    <Field label="Year of completion" name="year" value={form.year} onChange={(value) => setForm({ ...form, year: value })} type="number" />
                    <div className="form-actions"><Button type="button" variant="ghost" className="example-button" onClick={() => { setForm(example); setError(""); }}><RotateCcw />Use an example</Button><Button type="submit" disabled={!ready} className="submit-button">Submit certificate<ArrowRight /></Button></div>
                  </form>
                  <div className="panel-footnote"><LockKeyhole />Your details stay in this browser. No account needed.</div>
                </>
              ) : (
                <>
                  <div className="panel-title"><div><h2>Let’s check that certificate</h2><p>Enter the Certificate ID shared by the certificate holder.</p></div><span className="small-icon"><Search /></span></div>
                  <form className="verify-form" onSubmit={verify}>
                    <div className="form-field"><label htmlFor="certificate-id">Certificate ID<span className="required-mark">*</span></label><div className="verify-input-wrap"><Search /><Input id="certificate-id" className="certificate-input verify-input" required maxLength={40} placeholder="e.g. CERT-1001" value={certificateId} onChange={(event) => { setCertificateId(event.target.value); setResult(undefined); }} /></div><p className="field-note">A unique ID starting with CERT-, followed by a number.</p></div>
                    <Button type="submit" disabled={!ready} className="submit-button verify-submit"><ShieldCheck />Verify certificate<ArrowRight /></Button>
                  </form>
                  {result === undefined ? <div className="verify-hint"><Info />You can try CERT-1001, or choose a record from the registry below.</div> : result === null ? <div className="result not-found" role="status"><div className="result-header"><span className="result-icon"><X /></span><div><h3>Not found ✘</h3><p>No certificate matches “{certificateId.trim()}”.</p></div></div><p className="result-disclaimer">Double-check the ID with the certificate holder and try again. This demo can only find records saved in this browser.</p></div> : <div className="result" role="status"><div className="result-header"><span className="result-icon"><BadgeCheck /></span><div><h3>Verified ✔</h3><p>{result.id} · Registry record found</p></div></div><dl className="result-details"><Detail label="Full name" value={result.name} /><Detail label="Qualification" value={result.qualification} /><Detail label="School or university" value={result.school} /><Detail label="Country" value={result.country} /><Detail label="Year of completion" value={result.year} /></dl><p className="result-disclaimer"><Info className="inline size-3 mr-1" />Verification confirms a match in this demo registry, not the authenticity or equivalence of a qualification.</p></div>}
                  <div className="panel-footnote"><LockKeyhole />A local registry check. No external services.</div>
                </>
              )}
            </div>
          </section>

          <aside className="info-aside">
            <h2 className="aside-heading">{isAdd ? "Small steps. New opportunities." : "Confidence in three simple steps."}</h2>
            <div className="steps">
              <Step number="1" title={isAdd ? "Add your qualification" : "Get the Certificate ID"} text={isAdd ? "Your name, your school, your achievement. It starts with the essentials." : "Ask the certificate holder for the unique ID from their registration."} />
              <Step number="2" title={isAdd ? "Get your Certificate ID" : "Check the registry"} text={isAdd ? "One unique reference, ready to share with your next employer." : "Enter the ID to find its matching certificate record."} />
              <Step number="3" title={isAdd ? "Share with confidence" : "Review the details"} text={isAdd ? "An employer can find your registered qualification in seconds." : "See the name, qualification, institution, country, and year."} />
            </div>
            <div className="community"><img src={communityImage.url} alt="Three professionals walking together outside a university" className="community-image" /><div><h3>Talent has no borders.<br />Opportunity shouldn’t either.</h3><p>A small step towards recognising skills, wherever they come from.</p><div className="community-tags"><span><GraduationCap />Quality education</span><span><Globe2 />Decent work</span></div></div></div>
          </aside>
        </div>

        <section className="registry-section" aria-label="Certificate registry">
          <div className="registry-heading"><div><h2>{records.length > 4 ? "Recently registered" : "Meet the demo registry"}</h2><p>{records.length > 4 ? "Your latest certificates, alongside our example records." : "A few example qualifications. Real possibilities."}</p></div><span className="registry-count"><Users />{records.length} certificates</span></div>
          <div className="registry-table-wrap"><table className="registry-table"><thead><tr><th>Certificate holder</th><th>Qualification</th><th>Country</th><th>Certificate ID</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{displayRecords.map((record) => <tr key={record.id}><td><span className="table-person"><span className="initials">{record.name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("")}</span>{record.name}</span></td><td>{record.qualification}</td><td>{record.country}</td><td><span className="registry-id">{record.id}</span></td><td><span className="status-pill"><Check />Registered</span></td><td><Link className="record-link" to="/verify" search={{ id: record.id }} aria-label={`Check ${record.name}'s certificate`}>Check<ArrowRight /></Link></td></tr>)}</tbody></table></div>
        </section>
      </main>
      <footer className="site-footer"><div className="footer-inner"><span>© 2026 Check My Certificate. A world of potential.</span><span className="footer-note"><Sparkles />Supporting SDG 4 & SDG 8<span className="mx-2">·</span><ShieldCheck />Built on trust, open to everyone.</span></div></footer>
    </div>
  );
}

function Field({ label, name, value, onChange, wide = false, note, type = "text", autoComplete }: { label: string; name: string; value: string; onChange: (value: string) => void; wide?: boolean; note?: string; type?: string; autoComplete?: string }) {
  return <div className={`form-field ${wide ? "wide" : ""}`}><label htmlFor={name}>{label}<span className="required-mark">*</span></label><Input className="certificate-input" id={name} name={name} type={type} value={value} required maxLength={type === "text" ? 160 : undefined} min={type === "number" ? 1900 : undefined} max={type === "number" ? 2026 : undefined} autoComplete={autoComplete} onChange={(event) => onChange(event.target.value)} />{note && <p className="field-note">{note}</p>}</div>;
}
function Step({ number, title, text }: { number: string; title: string; text: string }) { return <div className="step"><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div><dt>{label}</dt><dd>{value}</dd></div>; }
