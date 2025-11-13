# Security Audit Report - Marfinetz Plumbing Website
**Date:** 2025-11-13
**Auditor:** Claude (Anthropic AI Security Audit)
**Scope:** Full codebase security review

## Executive Summary

A comprehensive security audit was conducted on the Marfinetz Plumbing website (marfinetzplumbing.org). The audit identified **4 high-priority vulnerabilities** and **3 medium-priority issues** that should be addressed. Overall, the website has good security practices in place, including proper secret management, CORS configuration, and security headers. However, there are critical dependency vulnerabilities and some XSS risks that need immediate attention.

### Risk Level: **MEDIUM-HIGH**

---

## Technology Stack

- **Frontend:** Next.js 14.1.0, React 18, TypeScript, Tailwind CSS
- **Backend:** Express.js 4.18.2, Node.js >=18
- **Database:** MongoDB (configured but not yet implemented)
- **APIs:** Anthropic Claude, AWS SES, Twilio, Google Places
- **Deployment:** Vercel (frontend), Railway (backend API), GitHub Pages

---

## Security Findings

### 🔴 CRITICAL ISSUES

#### 1. Next.js Version Has Critical Vulnerabilities
**Severity:** CRITICAL
**Location:** `package.json:26`
**Issue:** Next.js version 14.1.0 has multiple critical vulnerabilities including:
- Server-Side Request Forgery (SSRF) in Server Actions
- Cache Poisoning vulnerabilities
- Authorization bypass vulnerabilities
- Information exposure in dev server
- Denial of Service conditions

**Current Version:** 14.1.0
**Recommended:** 14.2.33 or higher

**Recommendation:**
```bash
npm update next
npm audit fix --force
```

**Risk:** Attackers could potentially bypass authorization, perform SSRF attacks, or cause denial of service.

---

#### 2. XSS Vulnerability in Google Reviews Rendering
**Severity:** HIGH
**Location:** `js/google-reviews.js:111-123`, `public/js/google-reviews.js:111-123`
**Issue:** User-provided content from Google Reviews API is directly interpolated into HTML without sanitization:

```javascript
html += `
  <div class="google-review">
    <div class="review-header">
      <img src="${photo}" alt="${review.author_name || 'Reviewer'}" />
      <div class="review-name">${review.author_name || 'Google User'}</div>
      <div class="review-text">${review.text || ''}</div>
    </div>
  </div>
`;
container.innerHTML = html;
```

**Risk:** If Google's API is compromised or returns malicious data, XSS attacks could be executed.

**Recommendation:** Implement HTML sanitization using DOMPurify or similar library:
```javascript
import DOMPurify from 'dompurify';
// Then sanitize all user content
const cleanName = DOMPurify.sanitize(review.author_name);
const cleanText = DOMPurify.sanitize(review.text);
```

Or use React's built-in XSS protection by rendering reviews as React components instead of using innerHTML.

---

### 🟡 HIGH PRIORITY ISSUES

#### 3. Dependency Vulnerabilities in Backend API
**Severity:** HIGH
**Location:** `api/lead-tracking/package.json`
**Issue:** Critical vulnerabilities in backend dependencies:
- **axios** (1.0.0 - 1.11.0): DoS attack vulnerability
- **form-data** (4.0.0 - 4.0.3): Unsafe random function for boundary generation

**Recommendation:**
```bash
cd api/lead-tracking
npm audit fix
```

---

#### 4. @babel/runtime Moderate Vulnerability
**Severity:** MODERATE
**Location:** Frontend dependencies
**Issue:** Inefficient RegExp complexity when transpiling named capturing groups (CVE rating: 6.2)

**Recommendation:**
```bash
npm update @babel/runtime
```

---

### 🟠 MEDIUM PRIORITY ISSUES

#### 5. Missing Strict-Transport-Security Header
**Severity:** MEDIUM
**Location:** `.htaccess`
**Issue:** While other security headers are configured, HSTS (HTTP Strict-Transport-Security) is missing.

**Current headers:**
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Content-Security-Policy (configured)
- ❌ Strict-Transport-Security: MISSING

**Recommendation:** Add to `.htaccess:6`:
```apache
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

---

#### 6. Overly Permissive CORS Configuration
**Severity:** MEDIUM
**Location:** `.htaccess:14`
**Issue:** CORS is configured with wildcard `Access-Control-Allow-Origin: *`, allowing any origin to make requests.

**Current configuration:**
```apache
Header set Access-Control-Allow-Origin "*"
```

**Recommendation:** Restrict CORS to specific trusted origins or implement origin checking in the backend (which is already done in `api/lead-tracking/index.js:22-63`). Consider removing the wildcard from `.htaccess` since the backend already handles CORS properly.

---

#### 7. Content Security Policy Allows 'unsafe-inline' Scripts
**Severity:** MEDIUM
**Location:** `.htaccess:10`
**Issue:** CSP includes `'unsafe-inline'` for script-src, which weakens XSS protection.

**Current CSP:**
```
script-src 'self' 'unsafe-inline' https://fonts.googleapis.com
```

**Recommendation:** Remove `'unsafe-inline'` and implement CSP nonces or hashes for inline scripts. This will require updating inline scripts in `app/layout.tsx:50-61` to use nonces.

---

### ✅ GOOD SECURITY PRACTICES FOUND

1. **Secrets Management:** ✅ All API keys and secrets are properly stored in environment variables
2. **Environment Files:** ✅ `.env` files are properly gitignored
3. **Input Validation:** ✅ Basic validation exists in `app/api/lead-submission/route.ts:34-39`
4. **CORS Configuration:** ✅ Backend has proper CORS origin checking
5. **Rate Limiting:** ✅ Implemented in `api/lead-tracking/services/rateLimiter.js`
6. **Error Handling:** ✅ Proper error handling throughout the codebase
7. **HTTPS Enforcement:** ✅ Deployed on Vercel and Railway (HTTPS by default)
8. **No Database Yet:** ✅ No SQL/NoSQL injection risks (database not implemented)
9. **Security Headers:** ✅ Most security headers properly configured
10. **GitHub Actions Security:** ✅ Proper permissions set (`contents: read`, `pages: write`, `id-token: write`)

---

## Issues Not Found (Good!)

- ❌ No hardcoded secrets or API keys
- ❌ No SQL/NoSQL injection vulnerabilities (database not yet used)
- ❌ No exposed sensitive data in public files
- ❌ No authentication bypass (no auth system implemented)
- ❌ No command injection vulnerabilities
- ❌ No path traversal vulnerabilities
- ❌ No insecure file uploads

---

## CSRF Protection Assessment

**Status:** ⚠️ LIMITED CSRF PROTECTION

The application currently has:
- CORS restrictions in place (limits cross-origin requests)
- SameSite cookies are not used (no session cookies exist)
- No CSRF tokens implemented

**Risk Level:** LOW (since there's no authentication system, CSRF risk is minimal)

**Recommendation:** If you implement user authentication in the future, implement CSRF tokens using a library like `csurf` for Express.js.

---

## Authentication & Authorization Assessment

**Status:** ✅ NO AUTHENTICATION SYSTEM

The application is a public-facing website with no user authentication, login, or protected routes. This is appropriate for a plumbing service website.

**Recommendations for Future:**
- If you add an admin dashboard, implement JWT-based authentication
- Use bcrypt for password hashing
- Implement role-based access control (RBAC)
- Add MFA for administrative access

---

## Input Validation Assessment

**Status:** ⚠️ BASIC VALIDATION PRESENT

Current validation:
- ✅ Required field checks in `app/api/lead-submission/route.ts:34-39`
- ✅ Client-side validation in forms
- ⚠️ No type validation beyond required fields
- ⚠️ No length limits on text inputs
- ⚠️ No format validation (email, phone number formats)

**Recommendation:** Implement comprehensive input validation using a library like Zod or Joi:

```typescript
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  urgency: z.enum(['emergency', 'same_day', 'this_week', 'flexible']),
  problem: z.string().min(10).max(1000)
});

// Then validate
const validatedData = leadSchema.parse(leadData);
```

---

## Priority Action Items

### Immediate (Fix within 24 hours)
1. ✅ Update Next.js to version 14.2.33+
2. ✅ Run `npm audit fix` in both root and `api/lead-tracking` directories
3. ✅ Implement HTML sanitization for Google Reviews

### Short-term (Fix within 1 week)
4. ✅ Add HSTS header
5. ✅ Review and tighten CORS policy
6. ✅ Implement comprehensive input validation

### Medium-term (Fix within 1 month)
7. ✅ Remove `'unsafe-inline'` from CSP and implement nonces
8. ✅ Consider implementing rate limiting on the frontend API routes
9. ✅ Add automated security scanning to CI/CD pipeline

---

## Automated Security Testing Recommendations

Add these tools to your CI/CD pipeline:

1. **Snyk** - Automated dependency scanning
2. **OWASP ZAP** - Automated penetration testing
3. **npm audit** - Run on every PR
4. **ESLint Security Plugin** - Detect security issues in code

Example GitHub Action:
```yaml
- name: Security Audit
  run: |
    npm audit --production --audit-level=high
    cd api/lead-tracking && npm audit --production --audit-level=high
```

---

## Compliance Considerations

- **GDPR:** If collecting EU user data, ensure proper consent and data handling
- **CCPA:** California residents' data requires specific protections
- **PCI DSS:** Not applicable (no payment processing on site)
- **SOC 2:** Consider if handling enterprise customers

---

## Monitoring Recommendations

1. Set up error monitoring (Sentry, LogRocket)
2. Enable Vercel Analytics for security insights
3. Monitor Railway logs for suspicious activity
4. Set up alerts for failed API requests
5. Review audit logs regularly (`api/lead-tracking/services/auditLogger.js`)

---

## Conclusion

The Marfinetz Plumbing website has a solid security foundation with good practices in place for secret management, CORS, and error handling. However, **critical dependency updates are needed immediately**, and XSS protection should be strengthened.

After addressing the high-priority issues, the security posture will be **GOOD** for a small business website.

### Overall Security Score: 7/10
*Score will improve to 9/10 after addressing critical and high-priority issues.*

---

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Next.js Security: https://nextjs.org/docs/app/building-your-application/configuring/security
- Content Security Policy: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- HSTS Preload: https://hstspreload.org/

---

**Report Generated:** 2025-11-13
**Next Review Recommended:** 2025-12-13 (1 month)
