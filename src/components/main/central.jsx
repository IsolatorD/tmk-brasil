import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import Lead from '../Lead';
import Goals from '../others/Goals';
import AuthService from '../../AuthService';

const Auth = new AuthService();

class Central extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Container className="animated fadeIn">
                <br/>
                <Row>
                    <Col xs="6" sm="6">
                        <h2>Contactar Lead</h2>
                   </Col>
                </Row>
                <br/>
                <Row>
                    <Col xs="12" sm="12">
                        <Goals/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <Lead em={this.props.match.params.em ? this.props.match.params.em : null }/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Central;