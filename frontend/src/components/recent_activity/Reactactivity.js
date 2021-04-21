import React, { Component } from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
// import numeral from 'numeral';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import Select from 'react-select';
// import { Row, Col, Container, Jumbotron } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { recentActivities } from '../../actions/recentactivityAction';
import Sidebarcomp from '../navbar/sidebar';
import Navheader from '../navbar/navbar';
import { reset } from '../../actions/creategroupAction';
import '../navbar/navbar.css';
import '../dashboard/dashboard.css';
import './recent_activity.css';
import backendServer from '../../webConfig';

class Recentactivitycl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      groupslist: [],
      recentstate: [],
      gpselectoptions: [],
      selectedvalue: [],
      asc: false,
      desc: true,
    };
    this.sorthandlerasc = this.sorthandlerasc.bind(this);
    this.sorthandlerdesc = this.sorthandlerdesc.bind(this);
    // this.pagesizehandler = this.pagesizehandler.bind(this);
  }

  componentDidMount() {
    this.getrecentacitvities();
    const getuserpgroups = this.getuserpgroups();

    const { reset1 } = this.props;
    reset1();
    const { recent } = this.props;
    this.setState({
      groupslist: getuserpgroups,
      recentstate: recent,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { recentstate } = this.state;
    if (nextState.recentstate.length !== recentstate.length) {
      return true;
    }
    return false;
  }

  getuserpgroups = () => {
    const { token } = this.state;
    axios
      .get(`${backendServer}/getuserpgroups/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      })
      .then((response) => {
        const newaar = response.data.map((el) => el);
        const { data } = response;

        const arrayforselect = data.map((el) => ({
          value: el,
          label: el,
        }));
        this.setState({
          groupslist: newaar,
          gpselectoptions: arrayforselect,
        });
        const { gpselectoptions } = this.state;
        const obj = { value: 'All Groups', label: 'All Groups' };
        this.setState({
          gpselectoptions: [...gpselectoptions, obj],
        });
      })
      .catch((err) => console.log(err));
  };

  sorthandlerasc = () => {
    const { recentstate, asc, desc } = this.state;
    if (asc === false && desc === true) {
      const sortasc = (recent1) => (key) =>
        [...recent1].sort(
          (intitial, next) =>
            new Date(intitial[key]).getTime() - new Date(next[key]).getTime()
        );
      // .reverse();

      const ascsort = sortasc(recentstate)('date1');
      this.setState({
        recentstate: ascsort,
        asc: true,
        desc: false,
      });
    }
  };

  sorthandlerdesc = () => {
    const { recentstate, asc, desc } = this.state;
    if (asc === true && desc === false) {
      const sortadesc = (recent1) => (key) =>
        [...recent1]
          .sort(
            (intitial, next) =>
              new Date(intitial[key]).getTime() - new Date(next[key]).getTime()
          )
          .reverse();

      const descsort = sortadesc(recentstate)('date1');
      this.setState({
        recentstate: descsort,
        asc: false,
        desc: true,
      });
    }
  };

  gpselectoptionshandler = (e) => {
    const newarr = e.value;
    this.setState({ selectedvalue: newarr });
  };

  displayresults = (groupname) => {
    const { recent } = this.props;
    this.setState({
      recentstate: recent,
    });
    const { recentstate } = this.state;
    const filtergrp = (recent1) => (key) =>
      [...recent1].filter((grp1) => grp1[key] === groupname);

    const filtergrps = filtergrp(recentstate)('gpname');
    this.setState({
      recentstate: filtergrps,
    });
    if (groupname === 'All Groups') {
      this.setState({
        recentstate: recent,
      });
    }
  };

  getrecentacitvities = () => {
    const { recentActivities1 } = this.props;
    recentActivities1();
  };

  render() {
    let redirectVar = null;
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to="/" />;
    }
    const { username1, errors } = this.props;
    const currusername = username1;
    const {
      recentstate,
      groupslist,
      gpselectoptions,
      selectedvalue,
    } = this.state;
    console.log(recentstate, groupslist, gpselectoptions, selectedvalue);
    let checkifactivitynull = false;
    if (isEmpty(recentstate)) {
      checkifactivitynull = true;
    }
    return (
      <div>
        {redirectVar}
        <Navheader />
        <div className="dashboard-flex">
          <div>
            <Sidebarcomp />
          </div>

          <div className="dashboard-box" style={{ overflowY: 'auto' }}>
            <section className="dashboard-heading-buttons">
              <section className="dashboard-heading">
                <h1>Recent Activity </h1>

                <ul className="button-right">
                  <li />
                </ul>
              </section>

              <section className="dashboard-center-sec">
                <div className="dashboard-center-section-block">
                  <div className="title" style={{ 'text-align': 'center' }}>
                    <h7>RECENT ACTIVITY</h7>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle
                      className="login-default"
                      id="dropdown-basic"
                    >
                      Page Size
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onSelect={() => {
                          // this.pagesizehandler();
                        }}
                      >
                        Page Size 2{' '}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onSelect={() => {
                          // this.pagesizehandler();
                        }}
                      >
                        Page Size 5
                      </Dropdown.Item>
                      <Dropdown.Item
                        onSelect={() => {
                          // this.pagesizehandler();
                        }}
                      >
                        Page Size 10
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="dashboard-center-section-block">
                  <div className="dashboard-block-border">
                    <div className="title" style={{ 'text-align': 'center' }}>
                      {' '}
                      RECENT ACTIVITY{' '}
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle
                        className="login-default"
                        id="dropdown-basic"
                      >
                        Sort
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onSelect={() => {
                            this.sorthandlerasc();
                          }}
                        >
                          Ascending{' '}
                        </Dropdown.Item>
                        <Dropdown.Item
                          onSelect={() => {
                            this.sorthandlerdesc();
                          }}
                        >
                          Descending
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                <div className="dashboard-center-section-block">
                  <div className="title" style={{ 'text-align': 'center' }}>
                    {' '}
                    RECENT ACTIVITY{' '}
                  </div>
                  <div
                    className="mygroups-right"
                    style={{
                      width: '300px',
                      display: 'flex',
                      'flex-direction': 'row',
                    }}
                  />

                  <Select
                    options={gpselectoptions}
                    placeholder="GroupName"
                    className="div-select"
                    onChange={(e) => this.gpselectoptionshandler(e)}
                    styles={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '30px',
                    }}
                  />
                  <Button
                    className="Signup-default"
                    onClick={(e) => this.displayresults(selectedvalue, e)}
                    tyles={{
                      display: 'inline-block',
                      float: 'right',
                    }}
                  >
                    GO
                  </Button>
                </div>
              </section>
            </section>

            <section className="transcations-sec1" style={{ width: '80%' }}>
              <div className="tranactions-heading1">
                {checkifactivitynull ? (
                  <h7>YOU HAVE NO ACTIVTIES TO DISPLAY ! </h7>
                ) : (
                  <div>
                    {' '}
                    {recentstate.map((activities) => (
                      <ul
                        className="recent-expenses"
                        style={{ 'list-style-type': 'none' }}
                      >
                        <li>
                          <div
                            className="Row"
                            style={{ display: 'flex', 'flex-direction': 'row' }}
                          >
                            <p>
                              {JSON.stringify(activities.paid) ===
                                JSON.stringify(currusername) &&
                                activities.gpname !== null && (
                                  <p>
                                    <p>
                                      <b>YOU </b>added a payment of{' '}
                                      <h6
                                        style={{
                                          color: '#3bb894',
                                          'font-weight': 'bold',
                                        }}
                                      >
                                        {activities.amnt}
                                      </h6>{' '}
                                      for <b>&quot;{activities.descp}&quot;</b>{' '}
                                      in <b>{activities.gpname} </b>
                                    </p>
                                  </p>
                                )}
                              {JSON.stringify(activities.paid) !==
                                JSON.stringify(currusername) && (
                                <p>
                                  <b>{activities.paid} </b>added a payment of{' '}
                                  <h6
                                    style={{
                                      color: '#ff652f',
                                      'font-weight': 'bold',
                                    }}
                                  >
                                    {activities.amnt}
                                  </h6>{' '}
                                  for <b>&quot;{activities.descp}&quot;</b> in{' '}
                                  <b>{activities.gpname} </b>;
                                </p>
                              )}
                              {JSON.stringify(activities.paid) ===
                                JSON.stringify(currusername) &&
                                activities.gpname === null && (
                                  <p>
                                    <b>You {activities.descp}</b>
                                  </p>
                                )}
                              <p>
                                <span>
                                  {activities.formatedmonth}{' '}
                                  {activities.formatedday},{' '}
                                  {activities.formatedyear} at{' '}
                                  {activities.time1}
                                </span>
                              </p>
                            </p>
                          </div>
                          <hr
                            style={{
                              height: '2px',
                              border: 'none',
                              color: 'grey',
                              'background-color': 'Grey',
                              'padding-top': '1px',
                              'padding-bottom': '1px',
                            }}
                          />
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
              <div className="transactions-owe" />
              <div className="transactions-owed" />
            </section>
            <p className="errmsg" style={{ color: 'maroon' }}>
              {' '}
              {errors}{' '}
            </p>
          </div>

          <div className="dashboard-right" />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    recentActivities1: () => dispatch(recentActivities()),
    reset1: () => dispatch(reset()),
  };
}

function mapStateToProps(store) {
  return {
    username1: store.login.user.username,
    email1: store.login.user.email,
    defaultcurrency: store.login.user.currencydef,
    errors: store.groups.error,
    usergroups: store.groups.groups,
    recent: store.transactions.recent,
  };
}

const Recentactivity = connect(
  mapStateToProps,
  mapDispatchToProps
)(Recentactivitycl);

Recentactivitycl.propTypes = {
  reset1: Proptypes.func,
  errors: Proptypes.string,
  username1: Proptypes.string,
  recent: Proptypes.instanceOf(Array),
  recentActivities1: Proptypes.func,
};

Recentactivitycl.defaultProps = {
  // profilepicstore: '',
  reset1: () => {},
  errors: '',
  username1: '',
  recent: [],
  recentActivities1: () => {},
};

export default Recentactivity;
