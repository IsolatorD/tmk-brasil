import React, { Component } from 'react';
import { Row, Col, Label, Input, FormGroup } from 'reactstrap';

class Cuenta extends Component {
  render() {
    let { handleChange, account_number, agency, bank } = this.props;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="6" sm="6">
            <FormGroup>
              <Label for="bank">Banco</Label>
              <Input type="text" value={bank} name="bank" id="bank" onChange={handleChange.bind(this)}/>
            </FormGroup>
          </Col>
          <Col xs="6" sm="6">
            <FormGroup>
              <Label for="agency">Agência</Label>
              <Input type="text" value={agency} name="agency" id="agency" onChange={handleChange.bind(this)}/>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12">
            <FormGroup>
              <Label for="account_number">Numero de conta</Label>
              <Input type="text" value={account_number} name="account_number" id="account_number" onChange={handleChange.bind(this)}/>
            </FormGroup>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Cuenta;