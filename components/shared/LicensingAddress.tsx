import styles from "./LicensingAddress.module.css";
import { Fragment } from "react";
const LicensingAddress = () => (
  <>
    <div className={styles.address}>
      <p>The Licensing Section</p>
      <p>Cheshire East Council</p>
      <p>Delamere House</p>
      <p>Delamere Street</p>
      <p>Crewe</p>
      <p>CW1 2LL</p>
    </div>

    <p>
      Or by email to:&nbsp;
      <a href="mailto:licensing@cheshireeast.gov.uk">
        licensing@cheshireeast.gov.uk
      </a>
    </p>
    <p>
      The application may be inspected at the Licensing Section of Cheshire East
      Council by prior appointment during normal office hours.
    </p>
    <p>
      It is an offence on summary conviction, to knowingly or recklessly make a
      false statement in connection with this application, the maximum fine for
      which is, unlimited.
    </p>
  </>
);

export default LicensingAddress;
