import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardText} from 'reactstrap';
import { Link } from "react-router-dom";

import AuthService from '../../AuthService';
import { Socket } from '../../helpers';

const Auth = new AuthService();

class Goals extends Component {
    constructor() {
        super();
        this.state = {
            myleads: 0,
            contacteds: null,
            //effectives: null,
            toContactResults: null,
            totalToContactResult: 0
        }
    }

    componentDidMount() {
        var userId = Auth.getUserId();
        Socket.emit('myLeads', userId);
        //Socket.emit('benefactor', userId);
        Socket.emit('contacts', userId);
        Socket.emit('toContact', userId);

        Socket.on('myLeadsResult', (myleads) => {
            this.setState({
                myleads
            });
        });
        /*Socket.on('benefactorResult', (effective) => {
            this.setState({
                effectives: effective
            });
        });*/
        Socket.on('contactsResult', (contacted) => {
            this.setState({
                contacteds: contacted
            });
        });
        Socket.on('toContactResult', (toContacts) => {
            this.setState({
                toContactResults: toContacts.toContact,
                totalToContactResult: toContacts.monthlyGoals
            });
        });
    }

    render() {
        return (
            <Container className="animated fadeIn">
                <br/>
                <Row>
                    <Col xs="3" sm="3">
                        <Link to="/dashboard/myleads" className="links">
                            <Card className="widget widget-blue box-shadow-widget">
                                <CardBody>
                                    <CardText className="widget-title text-white">{this.state.myleads}</CardText>
                                    <CardText className="widget-text text-white">Meus Leads</CardText>
                                </CardBody>
                            </Card>
                        </Link>
                    </Col>
                    <Col xs="1" sm="1"></Col>
                    <Col xs="3" sm="3">
                        <Link to="/dashboard/contacted" className="links">
                            <Card className="widget widget-blue box-shadow-widget">
                                <CardBody>
                                    <CardText className="widget-title text-white">{this.state.contacteds}</CardText>
                                    <CardText className="widget-text text-white">Contatados este mês</CardText>
                                </CardBody>
                            </Card>
                        </Link>
                    </Col>
                    {/*<Col xs="3" sm="3">
                        <Link to="/dashboard/effective" className="links">
                            <Card className="widget widget-green box-shadow-widget">
                                <CardBody>
                                    <CardText className="widget-title text-white">{this.state.effectives}</CardText>
                                    <CardText className="widget-text text-white">Efetivo este mês</CardText>
                                </CardBody>
                            </Card>
                        </Link>
                    </Col>*/}
                    <Col xs="1" sm="1"></Col>
                    <Col xs="3" sm="3">
                        <Card className="widget widget-purple box-shadow-widget">
                            <CardBody>
                                <CardText className="widget-title text-white">
                                    {this.state.toContactResults}
                                </CardText>
                                <CardText className="widget-text text-white">
                                    para objetivo de 
                                    <b>{' ' + this.state.totalToContactResult}</b>
                                </CardText>                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <br/>
            </Container>
        );
    }
}

export default Goals;