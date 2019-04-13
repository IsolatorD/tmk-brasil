import React, { Component } from 'react';
import { Collapse, Card, Table, Input } from "reactstrap";

class DropDownAsign extends Component {
  render() {
    let { open, url, blurInputs, name } = this.props;
    const urlName = (item) => {
      if(item.length > 60) {
        return item.substr(0, 60)+'...';
      } else {
        return item;
      }
    }

    const tabla = () => {
      if(url.length > 0) {
        return url.map((i,j) => {
          return(
            <tr key={j++}>
              <td>
                  <a href={i.name}>
                    {urlName(i.name)}
                  </a>
              </td>
              <td>{i.totalLeads}</td>
              <td>{i.nuevosLeads}</td>
              <td>{i.leadsDevueltos}</td>
              <td>
                <Input type="number" className={name} name={name} data-url={i.name} id={`${name}${j}`} min="0" onBlur={(e) => blurInputs(e, i.nuevosLeads, i.leadsDevueltos)}/>
              </td>
            </tr>
          );
        })
      } else {
        return(
          <tr>
            <td colspan="5">
              Não há dados
            </td>
          </tr>
        );
      }
    }
    return(
      <Collapse isOpen={open} className="animated fadeIn">
        <Card>
          <Table>
          <thead>
            <th>Url</th>
            <th>Registros Totais</th>
            <th>Quantidade Novo</th>
            <th>Retornado</th>
            <th>Atributo</th>
          </thead>
            <tbody>
              {tabla()}
            </tbody>
          </Table>
        </Card>
      </Collapse>
    )
  }
}

export default DropDownAsign;