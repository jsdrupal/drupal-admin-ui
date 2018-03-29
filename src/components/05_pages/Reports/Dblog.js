import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestDblogCollection } from '../../../actions/reports';

const Dblog = class Dblog extends Component {
  componentDidMount() {
    this.props.requestDblogCollection();
  }
  render() {
    return (<h1>what up?</h1>)
  }


}

const mapStateToProps = (state) => ({...state})


export default connect(mapStateToProps, { requestDblogCollection })(Dblog);
