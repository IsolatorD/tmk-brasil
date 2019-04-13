import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container } from "reactstrap";

import Central from "./main/central";
import DashBoardCentral from './main/DashBoard';
import DashBoardMe from './main/DashBoardMe';

import MyLeads from './donates/myLeads';
import Contacted from './donates/contacted';
import Effective from './donates/effective';

import Company from "./admin/company/company";
import Companies from './admin/company/companies';
import CompanyInfo from './admin/company/companyInfo';
import AppSettings from './admin/company/AppSettings';

import Users from './admin/user/Users';
import NewUsers from './admin/user/NewUsers';
import UserInfo from './admin/user/userInfo';

import NewRole from './admin/rol/NewRole';
import Roles from './admin/rol/roles';
import RoleInfo from './admin/rol/roleInfo';

import EditCampaign from './addons/campaignEdit';
import EditResult from './addons/resultEdit';
import EditContactabilidad from './addons/contactabilidadEdit';
import EditCancel from './addons/cancelEdit';

import Asign from './assignments/Asign';

import Auditoria from './admin/auditoria/auditoria';

import NewExport from './admin/exports/new';
import HistoryExport from './admin/exports/Historico';
import RecusasExport from './admin/exports/Recusas';

export default class RouterView extends Component {
    render() {
        return (
            <Container>
            <Switch>                      
                <Route exact path='/dashboard/index/:em?' component={ Central }/>
                <Route exact path='/dashboard/dash' component={ DashBoardCentral }/>
                <Route exact path='/dashboard/me' component={ DashBoardMe }/>
                
                <Route exact path='/dashboard/myleads' component={MyLeads}/>
                <Route exact path='/dashboard/contacted' component={Contacted}/>
                <Route exact path='/dashboard/effective' component={Effective}/>
                
                <Route exact path='/dashboard/admin/company/new' component={Company}/>
                <Route exact path='/dashboard/admin/company/list' component={Companies}/>
                <Route exact path='/dashboard/admin/company/info/:id' component={CompanyInfo}/>
                <Route exact path='/dashboard/admin/company/settings' component={AppSettings}/>                        
                <Route exact path='/dashboard/admin/user/list' component={Users}/>
                <Route exact path='/dashboard/admin/user/new' component={NewUsers}/>
                <Route exact path='/dashboard/admin/user/info/:id' component={UserInfo}/>

                <Route exact path='/dashboard/admin/assignments/asign' component={Asign}/>

                <Route exact path='/dashboard/admin/roles/new' component={NewRole}/>
                <Route exact path='/dashboard/admin/roles/list' component={Roles}/>
                <Route exact path='/dashboard/admin/roles/info/:id' component={RoleInfo}/>
                <Route exact path='/dashboard/admin/campaign/edit/:id' component={EditCampaign}/>
                <Route exact path='/dashboard/admin/result/edit/:id' component={EditResult}/>
                <Route exact path='/dashboard/admin/contact/edit/:id' component={EditContactabilidad}/>
                <Route exact path='/dashboard/admin/cancel/edit/:id' component={EditCancel}/>
                
                <Route exact path='/dashboard/admin/logs' component={Auditoria}/>

                <Route exact path='/dashboard/export/new' component={NewExport}/>
                <Route exact path='/dashboard/export/history' component={HistoryExport}/>
                <Route exact path='/dashboard/export/recusas' component={RecusasExport}/>

            </Switch>
        </Container>
        );
    }
}
