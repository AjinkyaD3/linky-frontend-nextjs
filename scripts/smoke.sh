#!/usr/bin/env bash
# Smoke test for a deployed (or locally running) Linky frontend.
# Usage: scripts/smoke.sh <base_url>
set -u

BASE="${1:?usage: smoke.sh <base_url>}"
BASE="${BASE%/}"
FAILS=0

pass() { echo "  PASS  $1"; }
fail() { echo "  FAIL  $1  ($2)"; FAILS=$((FAILS + 1)); }
status() { curl -s -o /dev/null -m 30 -w "%{http_code}" "$1"; }

echo "Frontend smoke test against $BASE"

for path in / /login /register /privacy /terms /robots.txt /sitemap.xml /manifest.webmanifest "/link-error?reason=not_found"; do
  got="$(status "$BASE$path")"
  if [ "$got" = "200" ]; then pass "GET $path"; else fail "GET $path" "expected 200, got $got"; fi
done

got="$(status "$BASE/this-page-should-not-exist-404")"
if [ "$got" = "404" ]; then pass "unknown route returns 404"; else fail "unknown route returns 404" "got $got"; fi

TITLE="$(curl -s -m 30 "$BASE/" | sed -n 's/.*<title>\([^<]*\)<.*/\1/p' | head -1)"
case "$TITLE" in *Linky*) pass "home page title ($TITLE)";; *) fail "home page title" "got '$TITLE'";; esac

HEADERS="$(curl -s -I -m 30 "$BASE/")"
for h in content-security-policy x-content-type-options x-frame-options referrer-policy; do
  if echo "$HEADERS" | grep -qi "^$h:"; then pass "security header $h"; else fail "security header $h" "missing"; fi
done

echo
if [ "$FAILS" -eq 0 ]; then echo "SMOKE TEST PASSED"; else echo "SMOKE TEST FAILED: $FAILS check(s)"; exit 1; fi
