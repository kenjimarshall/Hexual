import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";
const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && (
      <div
        className="col-auto d-flex justify-content-center mb-5"
        style={{ height: "100px" }}
      >
        <Loader type="Audio" color="#005b96" height="100" width="100" />
      </div>
    )
  );
};

export default LoadingIndicator;
