/** Primary and footer navigation. Routes that do not exist yet are not listed. */

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: NavItem[] = [
  { label: "Features", href: "/features", description: "What Dispense does, capability by capability." },
  { label: "How it works", href: "/how-it-works", description: "From account setup to your first payout." },
  { label: "Security", href: "/security", description: "How accounts and data are protected." },
  { label: "FAQ", href: "/faq", description: "Short answers to common questions." },
];

export const footerNav: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Product",
    items: [
      { label: "Features", href: "/features" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Download", href: "/download" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
      { label: "Contact support", href: "mailto:support" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Security", href: "/security" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Security", href: "/security" },
];
