export const contactHeroData = {
  titleStart: "Let's",
  titleHighlight: "Connect",
  text: "Whether you're looking to publish your thesis, explore partnership opportunities, or simply learn more about Global Scholar Publishing, our team is ready to assist.",
  cards: [
    {
      icon: "editorial",
      title: "Editorial Support",
      text: "For manuscript submissions and review inquiries.",
      linkText: "submissions@gspublisher.com",
      linkHref: "mailto:submissions@gspublisher.com"
    },
    {
      icon: "general",
      title: "General Enquiries",
      text: "Mon - Fri, 9:00 AM to 6:00 PM (GMT).",
      linkText: "+44 20 1234 5678",
      linkHref: "tel:+442012345678"
    },
    {
      icon: "hq",
      title: "Global Headquarters",
      text: "14 Academic Way,\nLondon, UK, EC1V 2NX",
      linkText: null,
      linkHref: null
    }
  ]
};

export const contactFormData = {
  titleStart: "Send a",
  titleHighlight: "Message",
  subtitle: "We aim to respond to all inquiries within 48 hours.",
  tabs: [
    { id: "general", label: "General" },
    { id: "publish", label: "Publish with Us" },
    { id: "partnership", label: "Partnerships" }
  ],
  fields: [
    { id: "name", label: "Full Name", placeholder: "e.g. Dr. Jane Doe", type: "text", required: true },
    { id: "email", label: "Email Address", placeholder: "jane@university.edu", type: "email", required: true },
    { id: "country", label: "Country / Region", placeholder: "e.g. United Kingdom", type: "text", required: true },
    { id: "subject", label: "Subject", placeholder: "How can we help?", type: "text", required: true },
    { id: "message", label: "Message", placeholder: "Tell us about your inquiry or research...", type: "textarea", required: true, fullWidth: true }
  ]
};
