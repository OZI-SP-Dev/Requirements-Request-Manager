import React from "react";
import { Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './AppHeader.css';

export const AppHeader: React.FunctionComponent<any> = (props) => {

    return (
        <Navbar fixed="top" expand="md" variant="dark" bg="dark" className="p-0 shadow">
            <Navbar.Brand className={(process.env.REACT_APP_TEST_SYS ? "test " : "") + "col-xs-1 col-sm-3 col-md-2 mr-0"}>Weekly Activity Report</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                    <NavDropdown title="Reports" id="basic-nav-dropdown">
                        <LinkContainer to="/Requests">
                            <NavDropdown.Item>Activities</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <LinkContainer to="/Not Implemented Yet">
                            <NavDropdown.Item>WAR</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 500, hide: 0 }}
                        overlay={
                            <Tooltip id="ContactUsNavTooltip">
                                Submit feedback, bug reports, or just say hello!
							    </Tooltip>
                        }
                    >
                        <button className="nav-link link-button">
                            Contact Us
						</button>
                    </OverlayTrigger>
                    <LinkContainer to="/RoleManagement">
                        <Nav.Link>Admin</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    );
}