import styles from "./index.module.scss";

export default function NotFoundVisual() {
  return (
    <div className={styles["bg-purple"]}>
      <div className={styles["stars"]}>
        <div className={styles["central-body"]}>
          <img className={styles["image-404"]} src="http://salehriaz.com/404Page/img/404.svg" width="300px" />
          <a href="/" className={styles["btn-go-home"]}>
            返回首页
          </a>
        </div>
        <div className={styles["objects"]}>
          <img className={styles["object_rocket"]} src="http://salehriaz.com/404Page/img/rocket.svg" width="40px" />
          <div className={styles["earth-moon"]}>
            <img className={styles["object_earth"]} src="http://salehriaz.com/404Page/img/earth.svg" width="100px" />
            <img className={styles["object_moon"]} src="http://salehriaz.com/404Page/img/moon.svg" width="80px" />
          </div>
          <div className={styles["box_astronaut"]}>
            <img
              className={styles["object_astronaut"]}
              src="http://salehriaz.com/404Page/img/astronaut.svg"
              width="140px"
            />
          </div>
        </div>
        <div className={styles["glowing_stars"]}>
          <div className={styles["star"]}></div>
          <div className={styles["star"]}></div>
          <div className={styles["star"]}></div>
          <div className={styles["star"]}></div>
          <div className={styles["star"]}></div>
        </div>
      </div>
    </div>
  );
}
