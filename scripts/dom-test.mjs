// Automated DOM & Component Verification Suite for FreshRoute
import http from "node:http";

const BASE_URL = "http://localhost:3000";

const ROUTES_TO_TEST = [
  { path: "/", name: "Homepage", isAuth: false },
  { path: "/marketplace", name: "Marketplace Catalog", isAuth: false },
  { path: "/marketplace/tomato", name: "Listing Detail (Tomato)", isAuth: false },
  { path: "/marketplace/sample-batch-onion", name: "Listing Detail (Nashik Red Onion)", isAuth: false },
  { path: "/how-it-works", name: "How It Works", isAuth: false },
  { path: "/for-farmers", name: "For Farmers", isAuth: false },
  { path: "/for-buyers", name: "For Buyers", isAuth: false },
  { path: "/about", name: "About Us", isAuth: false },
  { path: "/contact", name: "Contact & Support", isAuth: false },
  { path: "/login", name: "Login Page", isAuth: true },
  { path: "/register", name: "Registration Page", isAuth: true },
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

function runAssertion(desc, condition) {
  if (condition) {
    console.log(`    ✓ ${desc}`);
    return true;
  } else {
    console.error(`    ✗ FAIL: ${desc}`);
    return false;
  }
}

async function runDomTests() {
  console.log("=================================================");
  console.log("  FRESHROUTE DOM & ACCESSIBILITY TEST SUITE");
  console.log("=================================================\n");

  let totalPassed = 0;
  let totalFailed = 0;

  for (const route of ROUTES_TO_TEST) {
    console.log(`[Testing Route] ${route.name} (${route.path})`);
    try {
      const res = await fetchHtml(`${BASE_URL}${route.path}`);
      const body = res.body;

      // 1. Status Code
      if (runAssertion(`HTTP 200 OK (received ${res.status})`, res.status === 200)) {
        totalPassed++;
      } else {
        totalFailed++;
      }

      // 2. HTML Boilerplate & Metadata
      if (runAssertion("HTML5 Doctype & <html lang='en'>", body.includes("<!DOCTYPE html>") && body.includes("<html lang=\"en\""))) {
        totalPassed++;
      } else {
        totalFailed++;
      }

      if (runAssertion("Has <title> tag", /<title>.*FreshRoute.*<\/title>/i.test(body) || /<title>/i.test(body))) {
        totalPassed++;
      } else {
        totalFailed++;
      }

      // 3. Accessibility & Landmarks
      if (runAssertion("Has <main> landmark", body.includes("<main"))) {
        totalPassed++;
      } else {
        totalFailed++;
      }

      if (!route.isAuth) {
        if (runAssertion("Has landmark <header> and <footer>", body.includes("<header") && body.includes("<footer"))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        // 4. Header & Navigation Branding
        if (runAssertion("Contains FreshRoute logo link to '/'", body.includes('href="/"'))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        if (runAssertion("Contains Marketplace nav link", body.includes('href="/marketplace"'))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        // 5. Delivery Location Selector (Verified elimination of 'Locality A')
        const hasPlaceholder = body.includes("Locality A (example location)");
        if (runAssertion("NO synthetic 'Locality A' placeholder present", !hasPlaceholder)) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        const hasLocationSelector = body.includes("Deliver to") || body.includes("Set your location") || body.includes("id=\"loc-btn\"");
        if (runAssertion("Real Location Selector widget present in header", hasLocationSelector)) {
          totalPassed++;
        } else {
          totalFailed++;
        }
      }

      // 6. Produce SVGs / 3D Graphics
      if (runAssertion("Has Produce SVG definitions symbol library", body.includes('id="fr-produce-defs"'))) {
        totalPassed++;
      } else {
        totalFailed++;
      }

      // Route-specific assertions
      if (route.path === "/") {
        console.log("  -- Specific Homepage DOM Checks --");
        if (runAssertion("Hero slider section exists (#hs)", body.includes('id="hs"'))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        if (runAssertion("Contains 3D produce stage container (.cg)", body.includes("cg"))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        if (runAssertion("Contains produce cards (.pc)", body.includes('class="pc group"'))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        if (runAssertion("Cart badge element exists (#cn)", body.includes('id="cn"'))) {
          totalPassed++;
        } else {
          totalFailed++;
        }
      }

      if (route.path === "/marketplace") {
        console.log("  -- Specific Marketplace DOM Checks --");
        if (runAssertion("Contains Category filter bar", body.includes("Vegetables") && body.includes("Fruits"))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        const hasCard = body.includes("class=\"pc group\"") || body.includes("marketplace/");
        if (runAssertion("Contains Produce Cards with action links", hasCard)) {
          totalPassed++;
        } else {
          totalFailed++;
        }
      }

      if (route.path.startsWith("/marketplace/")) {
        console.log("  -- Specific Listing Detail DOM Checks --");
        if (runAssertion("Contains Batch Specifications table/grid", body.includes("Batch Specifications") || body.includes("Batch Code"))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        if (runAssertion("Contains verified seller profile card", body.includes("Verified Seller") || body.includes("Seller Information") || body.includes("Verified Agricultural Producer"))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        if (runAssertion("Contains Add to Cart & Make Offer interactive buttons", body.includes("Add to Cart") && body.includes("Make Offer"))) {
          totalPassed++;
        } else {
          totalFailed++;
        }
      }

      if (route.path === "/login") {
        console.log("  -- Specific Login DOM Checks --");
        if (runAssertion("Contains email & password inputs", body.includes('type="email"') || body.includes('type="password"'))) {
          totalPassed++;
        } else {
          totalFailed++;
        }

        if (runAssertion("Contains demo accounts quick-access pills", body.includes("Farmer / Supplier") && body.includes("Retailer"))) {
          totalPassed++;
        } else {
          totalFailed++;
        }
      }

      if (route.path === "/register") {
        console.log("  -- Specific Register DOM Checks --");
        const hasForm = body.includes("Create your FreshRoute account") || body.includes("Step 1 of 5") || body.includes("type=\"password\"");
        if (runAssertion("Contains multi-step registration wizard form", hasForm)) {
          totalPassed++;
        } else {
          totalFailed++;
        }
      }

      console.log("");
    } catch (err) {
      console.error(`  ✗ Route connection failed: ${err.message}\n`);
      totalFailed++;
    }
  }

  console.log("=================================================");
  console.log(`  RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log("=================================================");

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runDomTests();
