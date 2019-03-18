import React from "react";
import { DrizzleContext } from "drizzle-react";
import Scholarship from "../scholarship/scholarship.jsx"
import withDrizzle from "../../hoc/withDrizzle.jsx";

class ScholarshipList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scholarshipAddresses: []
    }
  }

  async componentDidMount() {
    const { drizzleContext: { drizzle } } = this.props;
    const contract = drizzle.contracts.ScholarshipManager;
    const scholarshipAddresses = await contract.methods.getScholarshipAddresses().call();
    this.setState({ scholarshipAddresses });
  }

  render() {
    return(
      this.state.scholarshipAddresses.map( address => <Scholarship key={address} contractAddress={address}/> )
    );
  }
}

export default withDrizzle(ScholarshipList);
