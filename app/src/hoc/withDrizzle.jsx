import React from "react";
import { DrizzleContext } from "drizzle-react";

const withDrizzle = Component => props => (
  <DrizzleContext.Consumer>
    { drizzleContext => <Component {...props} drizzleContext={drizzleContext} /> }
  </DrizzleContext.Consumer>
)

export default withDrizzle;
