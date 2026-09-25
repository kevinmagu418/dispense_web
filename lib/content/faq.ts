/**
 * FAQ content. Answers describe only what Dispense actually does today.
 * These entries also feed the FAQPage structured data.
 */

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Optional follow-up links shown under the answer. */
  links?: Array<{ label: string; href: string }>;
  /** Shown on the homepage teaser. */
  featured?: boolean;
};

export const faqs: FaqItem[] = [
  {
    id: "what-is-dispense",
    question: "What is Dispense?",
    answer:
      "Dispense is a personal money app. It keeps your everyday balance in one place, then lets you separate that money into sub-wallets for rent, transport, groceries, savings, emergency and education. You can see what is available and what is already committed.",
    featured: true,
  },
  {
    id: "how-does-dispense-work",
    question: "How does Dispense work?",
    answer:
      "You add money to your personal wallet, create the sub-wallets you need, and allocate amounts into them. When something has to be paid, you configure a payout from that sub-wallet with the amount, provider, date and time. Every movement is recorded in your activity history.",
    featured: true,
    links: [{ label: "See how it works", href: "/how-it-works" }],
  },
  {
    id: "what-is-a-sub-wallet",
    question: "What is a sub-wallet?",
    answer:
      "A sub-wallet is a named space inside Dispense that holds money for one purpose. Instead of one balance that has to cover everything, each sub-wallet holds its own allocated amount, and shows what has been paid and what remains.",
    featured: true,
  },
  {
    id: "separate-rent-and-transport",
    question: "Can I separate rent and transport money?",
    answer:
      "Yes. Rent and transport are separate sub-wallets with their own allocated amounts. Rent can be set aside in full the day income arrives and scheduled to pay out on a fixed date, while transport holds a smaller weekly amount that you top up as you go.",
    featured: true,
  },
  {
    id: "how-do-payouts-work",
    question: "How do payouts work?",
    answer:
      "A payout moves money out of a sub-wallet. When you configure one, you set the amount, choose the provider it should go through, and give it a date and time. Dispense keeps the schedule and records the outcome in your activity history so the status is always visible.",
  },
  {
    id: "can-i-change-a-scheduled-payout",
    question: "Can I change a scheduled payout?",
    answer:
      "Payout schedules belong to the sub-wallet they were configured on, so they can be reviewed and adjusted there. Anything you change is reflected in the activity history, so there is a record of what ran and what did not.",
  },
  {
    id: "where-can-i-download-dispense",
    question: "Where can I download Dispense?",
    answer:
      "Dispense is being prepared for release on Android and iOS. Store listings have not been published yet, so download links are not shown on this site. Join the waitlist from the download page and you will receive the links as soon as they are live.",
    links: [{ label: "Go to the download page", href: "/download" }],
  },
  {
    id: "what-platforms-are-supported",
    question: "What platforms are supported?",
    answer:
      "Dispense is built as a mobile application for Android and iOS. There is no separate desktop application; this website exists to introduce the product, explain how it works and point you to the app.",
  },
  {
    id: "how-do-i-create-an-account",
    question: "How do I create an account?",
    answer:
      "Open the app and sign up with your email address. You will receive a one-time code to confirm the address, complete a short profile, confirm the device you are using, and set a PIN that unlocks Dispense from then on.",
  },
  {
    id: "is-my-money-in-dispense",
    question: "Does Dispense hold my money?",
    answer:
      "Dispense organises the money you record in it and tracks the payouts you configure. Any regulated account or provider relationship involved in moving money is disclosed in the app before you use it. If a detail is not shown, it is not something we claim.",
  },
  {
    id: "how-do-i-get-help",
    question: "How do I get help?",
    answer:
      "Support is available by email. The in-app help section explains the account and payout flows, and the contact address on this site reaches the team directly. We do not list a phone number until one is staffed.",
    links: [{ label: "Contact support", href: "mailto:support" }],
  },
  {
    id: "what-happens-to-my-data",
    question: "What happens to my data?",
    answer:
      "Dispense collects what is needed to run your account and the payouts you configure. The privacy policy sets out what is collected, why, and how to ask about it.",
    links: [{ label: "Read the privacy policy", href: "/privacy" }],
  },
];

export const featuredFaqs = faqs.filter((item) => item.featured);
