import React from "react";
import ContentLoader from "react-content-loader";

import styles from "./Loader.module.scss";

export const TableLoader = () => (
  <div className={styles.loading_spinner_wrap}>
    <svg
      className={styles.loading_spinner}
      width="60"
      height="20"
      viewBox="0 0 60 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="15" r="4" />
      <circle cx="30" cy="15" r="4" />
      <circle cx="53" cy="15" r="4" />
    </svg>
  </div>
);

export const AddressLoader = () => (
  <ContentLoader
    width={320}
    height={680}
    speed={2}
    primaryColor="#f3f3f3"
    className={styles.address_spinner}
    secondaryColor="#ecebeb"
  >
    <rect x="30" y="60" rx="5" ry="5" width="220" height="200" />
    <rect x="270" y="60" rx="5" ry="5" width="220" height="200" />
    {/* <rect x="270" y="60" rx="5" ry="5" width="220" height="200" /> */}
  </ContentLoader>
);

export const MobileLoader = () => (
  <ContentLoader width={320} height={635}>
    <rect x="30" y="60" rx="5" ry="5" width="220" height="120" />
    <rect x="270" y="60" rx="5" ry="5" width="220" height="120" />

    <circle cx="50" cy="210" r="20" />
    <rect x="80" y="190" rx="5" ry="5" width="170" height="40" />
    <circle cx="290" cy="210" r="20" />
    <rect x="320" y="190" rx="5" ry="5" width="170" height="40" />

    <rect x="15" y="275" rx="5" ry="5" width="90" height="110" />
    <rect x="113" y="275" rx="5" ry="5" width="90" height="110" />
    <rect x="211" y="275" rx="5" ry="5" width="90" height="110" />

    <rect x="15" y="392" rx="5" ry="5" width="90" height="110" />
    <rect x="113" y="392" rx="5" ry="5" width="90" height="110" />
    <rect x="211" y="392" rx="5" ry="5" width="90" height="110" />

    <rect x="15" y="510" rx="5" ry="5" width="90" height="110" />

    <circle cx="35" cy="716" r="20" />
    <rect x="70" y="692" rx="5" ry="5" width="235" height="88" />

    <circle cx="35" cy="816" r="20" />
    <rect x="70" y="792" rx="5" ry="5" width="235" height="88" />
  </ContentLoader>
);

export const DesktopLoader = () => (
  <ContentLoader width={1700} height={2000}>
    <rect x="30" y="30" rx="5" ry="5" width="450" height="220" />
    <rect x="570" y="30" rx="5" ry="5" width="450" height="220" />
    <rect x="1100" y="30" rx="5" ry="5" width="450" height="220" />

    <rect x="15" y="380" rx="5" ry="5" width="200" height="85" />
    <rect x="223" y="380" rx="5" ry="5" width="200" height="85" />
    <rect x="431" y="380" rx="5" ry="5" width="200" height="85" />
    <rect x="639" y="380" rx="5" ry="5" width="200" height="85" />
    <rect x="847" y="380" rx="5" ry="5" width="200" height="85" />
    <rect x="1055" y="380" rx="5" ry="5" width="200" height="85" />
    <rect x="1263" y="380" rx="5" ry="5" width="200" height="85" />

    <circle cx="35" cy="570" r="20" />
    <rect x="70" y="550" rx="5" ry="5" width="325" height="88" />
    <circle cx="455" cy="570" r="20" />
    <rect x="500" y="550" rx="5" ry="5" width="325" height="88" />
    <circle cx="885" cy="570" r="20" />
    <rect x="920" y="550" rx="5" ry="5" width="325" height="88" />
    <circle cx="1305" cy="570" r="20" />
    <rect x="1340" y="550" rx="5" ry="5" width="325" height="88" />

    <circle cx="35" cy="698" r="20" />
    <rect x="70" y="678" rx="5" ry="5" width="325" height="88" />
    <circle cx="455" cy="698" r="20" />
    <rect x="500" y="678" rx="5" ry="5" width="325" height="88" />
    <circle cx="885" cy="698" r="20" />
    <rect x="920" y="678" rx="5" ry="5" width="325" height="88" />
    <circle cx="1305" cy="698" r="20" />
    <rect x="1340" y="678" rx="5" ry="5" width="325" height="88" />

    <circle cx="35" cy="826" r="20" />
    <rect x="70" y="806" rx="5" ry="5" width="325" height="88" />
    <circle cx="455" cy="826" r="20" />
    <rect x="500" y="806" rx="5" ry="5" width="325" height="88" />
    <circle cx="885" cy="826" r="20" />
    <rect x="920" y="806" rx="5" ry="5" width="325" height="88" />
    <circle cx="1305" cy="826" r="20" />
    <rect x="1340" y="806" rx="5" ry="5" width="325" height="88" />

    <circle cx="35" cy="954" r="20" />
    <rect x="70" y="934" rx="5" ry="5" width="325" height="88" />
    <circle cx="455" cy="954" r="20" />
    <rect x="500" y="934" rx="5" ry="5" width="325" height="88" />
    <circle cx="885" cy="954" r="20" />
    <rect x="920" y="934" rx="5" ry="5" width="325" height="88" />
    <circle cx="1305" cy="954" r="20" />
    <rect x="1340" y="934" rx="5" ry="5" width="325" height="88" />

    <circle cx="35" cy="1082" r="20" />
    <rect x="70" y="1062" rx="5" ry="5" width="325" height="88" />
    <circle cx="455" cy="1082" r="20" />
    <rect x="500" y="1062" rx="5" ry="5" width="325" height="88" />
    <circle cx="885" cy="1082" r="20" />
    <rect x="920" y="1062" rx="5" ry="5" width="325" height="88" />
    <circle cx="1305" cy="1082" r="20" />
    <rect x="1340" y="1062" rx="5" ry="5" width="325" height="88" />

    <circle cx="35" cy="1210" r="20" />
    <rect x="70" y="1190" rx="5" ry="5" width="325" height="88" />
    <circle cx="455" cy="1210" r="20" />
    <rect x="500" y="1190" rx="5" ry="5" width="325" height="88" />
    <circle cx="885" cy="1210" r="20" />
    <rect x="920" y="1190" rx="5" ry="5" width="325" height="88" />
    <circle cx="1305" cy="1210" r="20" />
    <rect x="1340" y="1190" rx="5" ry="5" width="325" height="88" />

    <circle cx="35" cy="1338" r="20" />
    <rect x="70" y="1318" rx="5" ry="5" width="325" height="88" />
    <circle cx="455" cy="1338" r="20" />
    <rect x="500" y="1318" rx="5" ry="5" width="325" height="88" />
    <circle cx="885" cy="1338" r="20" />
    <rect x="920" y="1318" rx="5" ry="5" width="325" height="88" />
    <circle cx="1305" cy="1338" r="20" />
    <rect x="1340" y="1318" rx="5" ry="5" width="325" height="88" />

    <circle cx="35" cy="1366" r="20" />
    <rect x="70" y="1346" rx="5" ry="5" width="325" height="88" />
    <circle cx="455" cy="1366" r="20" />
    <rect x="500" y="1346" rx="5" ry="5" width="325" height="88" />
    <circle cx="885" cy="1366" r="20" />
    <rect x="920" y="1346" rx="5" ry="5" width="325" height="88" />
    <circle cx="1305" cy="1366" r="20" />
    <rect x="1340" y="1346" rx="5" ry="5" width="325" height="88" />
  </ContentLoader>
);
