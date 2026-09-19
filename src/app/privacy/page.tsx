import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/legal-page";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "What data Linky collects when you shorten a link or click one, why it is collected, and how to have it deleted.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title={TITLE} lastUpdated="2026-09-19">
      <section>
        <p>
          Linky is a URL shortener operated by Ajinkya Dhotre. This page explains what
          data the service stores, why, and how to get it removed. It is written to
          describe what the software actually does — if the behaviour described here and
          the behaviour of the service ever disagree, the service is the bug.
        </p>
      </section>

      <section>
        <h2>Data you give us</h2>
        <ul>
          <li>
            <strong>Account details</strong> — your name, email address and, optionally, a
            profile photo. Your password is stored only as a bcrypt hash; it is never
            stored or logged in plain text.
          </li>
          <li>
            <strong>Links you create</strong> — the destination URL, the short code, and
            any options you set (password, expiry, one-time use, tags). Link passwords are
            also stored hashed.
          </li>
        </ul>
      </section>

      <section>
        <h2>Data collected when a link is clicked</h2>
        <p>
          Linky exists to report on clicks, so each visit to a short link is recorded. For
          every click we store the time, the referring page, the browser, operating system
          and device type derived from the user agent, and a country-level location derived
          from the IP address.
        </p>
        <ul>
          <li>We do not sell click data or share it with advertisers.</li>
          <li>We do not set advertising or cross-site tracking cookies.</li>
          <li>
            Click data is visible only to the owner of the link (and to a site
            administrator for abuse handling).
          </li>
        </ul>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Linky sets one cookie, <code>linky_at</code>. It is an httpOnly, SameSite
          session cookie holding your access token, and it exists so that opening a
          private short link directly in a browser can check that you are allowed to see
          it. It is strictly necessary for the service to function and is not used for
          analytics or advertising, so no consent banner is shown for it.
        </p>
      </section>

      <section>
        <h2>Third parties</h2>
        <ul>
          <li>
            <strong>Supabase</strong> — hosts the PostgreSQL database holding accounts,
            links and click records.
          </li>
          <li>
            <strong>Render</strong> — hosts the API, and processes request metadata such
            as IP addresses as part of serving traffic.
          </li>
          <li>
            <strong>Resend</strong> — delivers transactional email (password resets only).
            No marketing email is sent.
          </li>
        </ul>
      </section>

      <section>
        <h2>Retention and deletion</h2>
        <p>
          Link and click records are kept for as long as the link exists. Deleting a link
          deletes its click history. Deleting your account deletes your links and their
          click history. Password reset tokens and refresh tokens expire automatically and
          are removed once expired.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can edit or delete any individual link at any time, and delete your account
          and everything attached to it, from{" "}
          <Link href="/settings">your settings page</Link>. For anything that page does not
          cover — including a request to see or erase data held about you — email{" "}
          <a href="mailto:ajinkyadhotre202@gmail.com">ajinkyadhotre202@gmail.com</a> and
          we will action it.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          If this policy changes materially, the &ldquo;last updated&rdquo; date above
          changes with it. Continued use of the service after that date means the updated
          policy applies.
        </p>
      </section>
    </LegalPage>
  );
}
