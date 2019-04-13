import React, { Component } from 'react';
import { Row, Col, Label, Input, FormGroup } from 'reactstrap';
import $ from 'jquery';
import Inputmask from "inputmask";

class Tarjeta extends Component {
  render() {
    let {card_number, expiration_month, expiration_year, handleChange } = this.props
    var im = new Inputmask('9999-9999-9999-9999');
    im.mask($('#card_numberE'));
    var im2 = new Inputmask('99');
    im2.mask($('#mes_expE'));
    var im3 = new Inputmask('9999');
    im3.mask($('#año_expE'));
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <FormGroup>
              <Label for="card_numberE">Número de cartão</Label>
              <Input type="text" value={card_number} name="card_number" id="card_numberE" onChange={handleChange.bind(this)}/>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="6" sm="6">
            <FormGroup>
              <Label for="mes_expE">Mês de expiração</Label>
              <Input type="text" value={expiration_month} name="expiration_month" id="mes_expE" onChange={handleChange.bind(this)}/>
            </FormGroup>
          </Col>
          <Col xs="6" sm="6">
            <FormGroup>
              <Label for="año_expE">Año de expiração</Label>
              <Input type="text" value={expiration_year} name="expiration_year" id="año_expE" onChange={handleChange.bind(this)}/>
            </FormGroup>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Tarjeta;