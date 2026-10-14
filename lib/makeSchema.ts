interface Props {
  name: string;
  url: string;
  description: string | undefined;
  faqSchema?: { question: string; answer: string }[];
}

function makeSchema({ name, url, description, faqSchema }: Props): string {
  const graph: object[] = [
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name,
      description,
      inLanguage: "en-GB",
      isPartOf: {
        "@type": "WebSite",
        name: "Cheshire East Council",
        url: "https://www.cheshireeast.gov.uk",
      },
    },
    {
      "@type": "GovernmentService",
      name,
      serviceType: "Guidance and signposting",
      provider: {
        "@type": "GovernmentOrganization",
        name: "Cheshire East Council",
        url: "https://www.cheshireeast.gov.uk",
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Cheshire East",
      },
    },
  ];

  if (faqSchema?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqSchema.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    });
  }

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}

export default makeSchema;
