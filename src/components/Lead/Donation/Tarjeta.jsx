import React, { Component } from 'react';
import { Row, Col, Label, Input, FormGroup } from 'reactstrap';
import $ from 'jquery';
import Inputmask from "inputmask";

class Tarjeta extends Component {
  render() {
    let {card_number, expiration_month, expiration_year, handleChange } = this.props
    var im = new Inputmask('9999-9999-9999-9999');
    im.mask($('#card_number'));
    var im2 = new Inputmask('99');
    im2.mask($('#mes_exp'));
    var im3 = new Inputmask('9999');
    im3.mask($('#año_exp'));
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <FormGroup>
              <Label for="card_number">Número de cartão</Label>
              <Input type="text" value={card_number} name="card_number" id="card_number" onChange={handleChange.bind(this)}/>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="6" sm="6">
            <FormGroup>
              <Label for="mes_exp">Mês de expiração</Label>
              <Input type="text" value={expiration_month} name="expiration_month" id="mes_exp" onChange={handleChange.bind(this)}/>
            </FormGroup>
          </Col>
          <Col xs="6" sm="6">
            <FormGroup>
              <Label for="año_exp">Año de expiração</Label>
              <Input type="text" value={expiration_year} name="expiration_year" id="año_exp" onChange={handleChange.bind(this)}/>
            </FormGroup>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Tarjeta;