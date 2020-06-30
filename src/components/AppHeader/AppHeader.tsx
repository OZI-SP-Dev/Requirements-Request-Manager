import React from "react";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './AppHeader.css';

export const AppHeader: React.FunctionComponent<any> = (props) => {

    return (
        <Navbar expand="md" variant="dark" bg="dark" className="p-0 shadow m-0">
            <Navbar.Brand className={(process.env.REACT_APP_TEST_SYS ? "test " : "") + "col-md-3 mr-0"}>
                Requirements Request Manager
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                    <NavDropdown title="Reports" id="basic-nav-dropdown">
                        <LinkContainer to="/Requests">
                            <NavDropdown.Item>Requests</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <LinkContainer to="/Not Implemented Yet">
                            <NavDropdown.Item>Not Implemented Yet</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    {/*<OverlayTrigger
                        placement="bottom"
                        delay={{ show: 500, hide: 0 }}
                        overlay={
                            <Tooltip id="ContactUsNavTooltip">
                                Submit feedback, bug reports, or just say hello!
							</Tooltip>
                        }
                    >
                        <Button className="nav-link link-button">
                            Contact Us
						</Button>
                    </OverlayTrigger>*/}
                    <LinkContainer to="/RoleManagement">
                        <Nav.Link>Admin</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    );
}