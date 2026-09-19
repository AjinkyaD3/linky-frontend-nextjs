import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/legal-page";

const TITLE = "Terms of Service";
const DESCRIPTION =
  "The rules for using Linky: acceptable use, account responsibilities, availability and liability.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title={TITLE} lastUpdated="2026-09-19">
      <section>
        <p>
          By creating a Linky account or shortening a link with this service, you agree to
          these terms. If you do not agree with them, please do not use the service.
        </p>
      </section>

      <section>
        <h2>The service</h2>
        <p>
          Linky turns long URLs into short ones and reports on the resulting clicks. It is
          provided free of charge and on an &ldquo;as is&rdquo; basis. No uptime guarantee
          is offered, and features may change or be withdrawn.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <ul>
          <li>You are responsible for keeping your password and API keys confidential.</li>
          <li>
            You are responsible for everything done through your account or your API keys.
          </li>
          <li>Accounts are for a single person or organisation; do not resell access.</li>
          <li>
            Tell us promptly at{" "}
            <a href="mailto:ajinkyadhotre202@gmail.com">ajinkyadhotre202@gmail.com</a> if
            you believe your account has been compromised.
          </li>
        </ul>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You may not use Linky to shorten or distribute links to:</p>
        <ul>
          <li>Malware, phishing pages, or anything designed to deceive or defraud.</li>
          <li>Content that is illegal where it is hosted or where it is accessed.</li>
          <li>
            Material that sexually exploits children, incites violence, or harasses a
            person.
          </li>
          <li>Spam, or bulk unsolicited messaging of any kind.</li>
          <li>
            Anything intended to disguise the destination in order to bypass a security
            control or a platform&rsquo;s link policy.
          </li>
        </ul>
        <p>
          You also may not attempt to disrupt the service — including circumventing rate
          limits, probing for vulnerabilities without permission, or scraping other
          users&rsquo; links or analytics.
        </p>
      </section>

      <section>
        <h2>Enforcement</h2>
        <p>
          Links that breach these terms may be disabled and accounts suspended or deleted,
          without notice where the content is harmful. Abuse can be reported to{" "}
          <a href="mailto:ajinkyadhotre202@gmail.com">ajinkyadhotre202@gmail.com</a>.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          You keep ownership of the URLs and any content you submit. You grant us only the
          permission needed to operate the service — storing your links, serving the
          redirects, and generating QR codes and analytics for you.
        </p>
      </section>

      <section>
        <h2>Availability and liability</h2>
        <p>
          The service runs on free hosting tiers and may be slow, paused, or unavailable.
          Short links are not a durable archive; keep your own record of anything
          important. To the fullest extent permitted by law, we are not liable for any
          indirect or consequential loss arising from use of the service, including lost
          traffic, lost revenue, or a link that stops resolving.
        </p>
      </section>

      <section>
        <h2>Privacy</h2>
        <p>
          Data handling is described in the <Link href="/privacy">Privacy Policy</Link>,
          which forms part of these terms.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          These terms may be updated; the &ldquo;last updated&rdquo; date above will
          change when they are. Continued use after that date means you accept the updated
          terms.
        </p>
      </section>
    </LegalPage>
  );
}
