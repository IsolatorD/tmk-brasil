import React from 'react';
import { Input, Badge, Button, Col, Row, TabPane, ButtonGroup, Form, InputGroup, InputGroupAddon } from "reactstrap";

const Gateway = ({currenciesToAdd, currencies, handleChange, toDo, toAdd, toDelete, handleSubmit, addDelete, gateway, url, id}) => {
  return (
    <TabPane tabId={id} className="animated fadeIn">
      <Row>
        <Col xs="6" sm="6" md="6" className="mx-auto my-4">
          <Row>
            <Col xs="2" sm="2" md="2">
              <img src={`/assets/img/${url}.png`}
                alt={`${gateway} Logo`}
                style={{width: '2.5em', height: '2.5em'}}/>
            </Col>
            <Col xs="10" sm="10" md="10">
              <h1><Badge color="primary">{gateway} </Badge></h1>
            </Col>
          </Row>
          <Row>
            { currencies.length > 0
              ? <p className="h5 my-5"><b>Monedas aceptadas:</b> {currencies.join(", ")}.</p>
              : <p className="h5 my-5">No hay monedas seleccionadas para {gateway} .</p>
            }
          </Row>
          <Row>
            <ButtonGroup className="col-6">
              <Button disabled={toDo === 'add' ? true : false}
                color="primary"
                onClick={toAdd}>Agregar</Button>
              <Button disabled={toDo === 'delete' ? true : false}
                color="danger"
                onClick={toDelete}>Eliminar</Button>
            </ButtonGroup>
            { toDo 
              ? <Form onSubmit={e => handleSubmit(e, gateway)} className="ml-auto col-6">
                <InputGroup>
                  <Input type="select"
                    name="addDelete"
                    id="addDelete"
                    value={addDelete}
                    onChange={handleChange.bind(this)}>
                    <option value="" disabled>Seleccione:</option>
                    { currenciesToAdd }
                  </Input>
                  { toDo === 'add' 
                    ? <InputGroupAddon addonType="append">
                        <Button color="primary" disabled={addDelete ? false : true}>Añadir</Button>
                      </InputGroupAddon>
                    : <InputGroupAddon addonType="append">
                        <Button color="danger" disabled={addDelete ? false : true}>Quitar</Button>
                      </InputGroupAddon>
                  }
                </InputGroup>
              </Form>
              : ''
            }
          </Row>
        </Col>
      </Row>
    </TabPane>
  );
}

export default Gateway;
