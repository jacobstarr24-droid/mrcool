// ================================================================
// config.js — The single file to update when anything changes
// ================================================================
const CONFIG = {
  brand: {
    name:     "Mini Split Depot",               // UPDATE: Brand name — auto-updates nav, footer, all page titles
    tagline:  "Premium Mini Splits. Unbeatable Prices.",
    email:    "info@minisplitdepot.com",         // UPDATE: Real contact email
    phone:    "",                                 // UPDATE: Phone number — leave empty to hide
    logo:     "",                                 // UPDATE: Path to logo image (e.g. "images/logo.svg") — leave empty for icon
    logoIcon: "❅",                          // ❅ shown when no logo image is set
    domain:   "https://minisplitdepot.com",      // UPDATE: Live domain (used for OG / canonical tags)
    socialLinks: {
      facebook:  "",   // UPDATE: Full Facebook page URL
      instagram: "",   // UPDATE: Full Instagram URL
      youtube:   "",   // UPDATE: Full YouTube channel URL
    },
  },

  links: {
    shopify:    "#",                              // UPDATE: Shopify store URL when ready
    mrcoolSite: "https://mrcool.com",
  },

  forms: {
    web3formsKey: "YOUR_WEB3FORMS_KEY",           // UPDATE: Free key at web3forms.com
  },

  meta: {
    ogImage: "images/og-image.jpg",               // UPDATE: Social share image (1200×630 recommended)
  },

  announcement: {
    enabled:   true,
    text:      "Free Shipping on all orders",
    highlight: "complete systems, partner pricing &bull; 115V Plug-In models available — no electrician needed",
    linkText:  "Questions? Contact us →",
    linkHref:  "contact.html",
  },

  shipping: {
    free:           true,
    processingDays: "1–2",    // "1–2" business days to process
    deliveryDays:   "5–7",    // "5–7" business days to deliver
  },

  support: {
    responseTime: "24 hours",
    hours:        "Mon – Fri",
  },

  policies: {
    returnDays: 30,                               // Return window in days
  },

  discount:         0.10,                        // Depot is this % cheaper than Mr. Cool
  urgencyThreshold: 5,                           // Show "Only X left" badge at or below this stock level

  testimonials: [
    {
      quote:    "Saved over $400 compared to buying through the retailer directly. The comparison page made it impossible to justify paying more. Installed our 18k unit in about 7 hours — solid instructions included.",
      name:     "Mike R.",
      location: "Dallas, TX",
      product:  "18,000 BTU",
      stars:    5,
    },
    {
      quote:    "The 12k unit has been running all summer in our master bedroom and the electricity bill difference is real. Quieter than I expected and the WiFi control is a genuine quality-of-life upgrade.",
      name:     "Sarah K.",
      location: "Phoenix, AZ",
      product:  "12,000 BTU",
      stars:    5,
    },
    {
      quote:    "Used the size calculator on this site and it pointed me straight to the right unit. Would have probably bought the wrong BTU without it. Same product as elsewhere, $120 cheaper. Easy choice.",
      name:     "David L.",
      location: "Atlanta, GA",
      product:  "9,000 BTU",
      stars:    5,
    },
  ],
};
