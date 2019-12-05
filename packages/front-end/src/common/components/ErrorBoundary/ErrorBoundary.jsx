import React from "react";
import BrokenLink from "../../assets/broken_link.png";
import styles from "./ErrorBoundary.module.scss";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log(errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    const { error } = this.state;
    return error ? (
      <div className={styles.wrapper}>
        <img src={BrokenLink} alt="Broken Link" />
        <h3>Ah! Technical glitch</h3>
        <small>
          Our engineers are currently working on resolving this issue.
        </small>
        <small>You may need to refresh the page or try again.</small>
      </div>
    ) : (
      this.props.children
    );
  }
}
