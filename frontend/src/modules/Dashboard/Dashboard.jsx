import React from "react";
import Card from "../../common/components/Card";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  return (
    <>
      <div className={styles.dashboard}>
        {/* <div className={styles.dashboard__item}>
          <Card>
          </Card>
        </div> */}
        {/* <div
          className={[
            styles.dashboard__item,
            styles.dashboard__item__full
          ].join(" ")}
        >
          <Card>
            <img src="https://imgs.xkcd.com/comics/decline.png" alt="" />
          </Card>
        </div> */}
      </div>
    </>
  );
}
