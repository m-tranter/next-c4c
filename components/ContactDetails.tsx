import styles from "./ContactDetails.module.css";
import Icon from "@/components/shared/Icon";
import PhoneIcon from "@/components/Icons/PhoneIcon";
import MailIcon from "@/components/Icons/MailIcon";
import WebsiteIcon from "@/components/Icons/WebsiteIcon";
import LocationIcon from "@/components/Icons/LocationIcon";

type Contact = {
  title?: string;
  text?: string;
  telephone?: Array<{ telephone?: string; extension?: string }>;
  email?: Array<{ email?: string }>;
  website?: Array<{ website?: string }>;
  address?: Array<{ addressLine01?: string; city?: string; postcode?: string }>;
  socialLinks?: Array<{ platform?: string; url?: string }>;
};

type Props = {
  data: {
    contacts?: Contact[];
  };
};

const ContactDetails = ({ data }: Props) => {
  const contactList = data?.contacts || [];

  // Helper to render a section with icon
  const renderIconSection = (
    icon: React.ReactNode,
    label: string,
    content: React.ReactNode,
    ind: number,
  ) => {
    return (
      <div
        key={`${label}_${ind}`}
        className={`${styles.cardSection} grid grid-cols-[2.5rem_auto] items-center`}
      >
        <div className="[&>svg]:block">
          <Icon size="lg">{icon}</Icon>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.sectionItem}>
            {label && <span className={styles.sectionLabel}>{label}:</span>}
            {content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={styles.container}
      itemScope
      itemType="https://schema.org/Organization"
    >
      {contactList.map((contact, i) => {
        return (
          <div key={i} className={styles.card}>
            <h3 className={styles.cardHeading} itemProp="name">
              {contact.title}
            </h3>
            {contact.text && <p className={styles.cardText}>{contact.text}</p>}

            {contact.telephone &&
              contact.telephone.map((e) =>
                renderIconSection(
                  <PhoneIcon />,
                  "Phone",
                  <a
                    itemProp="telephone"
                    className={styles.sectionLink}
                    href={`tel:${e.telephone}`}
                  >
                    {e.telephone}
                    {e.extension && ` ext. ${e.extension}`}
                  </a>,
                  i,
                ),
              )}

            {contact.email &&
              contact.email.map((e) =>
                renderIconSection(
                  <MailIcon />,
                  "Email",
                  <a
                    itemProp="email"
                    className={styles.sectionLink}
                    href={`mailto:${e.email}`}
                  >
                    {e.email}
                  </a>,
                  i,
                ),
              )}

            {contact.website &&
              contact.website.map((e) =>
                renderIconSection(
                  <WebsiteIcon />,
                  "Website",
                  <a
                    itemProp="url"
                    className={styles.sectionLink}
                    href={e.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {e.website}
                  </a>,
                  i,
                ),
              )}

            {contact.address &&
              contact.address.length > 0 &&
              renderIconSection(
                <LocationIcon />,
                "",
                <div
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <span itemProp="streetAddress">
                    {contact.address[0].addressLine01 && (
                      <span>{contact.address[0].addressLine01}, </span>
                    )}
                    {contact.address[0].city && (
                      <span>{contact.address[0].city}, </span>
                    )}
                  </span>
                  {contact.address[0].postcode && (
                    <span itemProp="postalCode">
                      {contact.address[0].postcode}
                    </span>
                  )}
                </div>,
                i,
              )}

            {contact.socialLinks && contact.socialLinks.length > 0 && (
              <div className={`${styles.cardSection} ${styles.socialLinks}`}>
                <div>
                  {contact.socialLinks.map((link, j) => (
                    <div key={j} className={styles.sectionItem}>
                      <a
                        className={styles.sectionLink}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.platform}
                      >
                        <span className="visually-hidden">{link.platform}</span>
                        {link.platform}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContactDetails;
