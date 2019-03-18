import React from "react";
import { hot } from "react-hot-loader";
import { DrizzleContext } from "drizzle-react";
import style from "./app.scss";
import ScholarshipList from "./scholarship_list/ScholarshipList.jsx";
import withDrizzle from "../hoc/withDrizzle.jsx";

const App = ({ drizzleContext: { initialized } }) => {
      if (!initialized) {
        return "Loading...";
      }

      return (
        <ScholarshipList />
      );
}

export default hot(module)(withDrizzle(App));
