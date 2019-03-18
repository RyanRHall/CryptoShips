import React from "react";
import { DrizzleContext } from "drizzle-react";
import withDrizzle from "../../hoc/withDrizzle.jsx";
import { contractName, abi as scholarshipABI } from "../../../../build/contracts/Scholarship.json";

class Scholarship extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const { drizzleContext: { drizzle } } = this.props;
    var contractConfig = {
      contractName,
      web3Contract: new web3.eth.contract(scholarshipABI, this.props.contractAddress)
    }
    // debugger
    // Or using the Drizzle context object
    drizzle.addContract(contractConfig, [])
    debugger
  }

  render() {
    return this.props.contractAddress;
  }
}

export default withDrizzle(Scholarship);
