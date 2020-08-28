import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import React, { useContext } from "react";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { UserContext } from "../../providers/UserProvider";
import { RoleDefinitions } from "../../utils/RoleDefinitions";
import './AppHeader.css';

export const AppHeader: React.FunctionComponent<any> = (props) => {

    const userContext = useContext(UserContext);

    return (
        <Navbar expand="md" variant="dark" bg="dark" className="p-0 shadow m-0">
            <Navbar.Brand className={(process.env.REACT_APP_TEST_SYS ? "test " : "") + "col-xs-1 col-sm-3 col-md-4 col-lg-3 mr-0"}>
                Requirements Request Manager
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer isActive={m => m !== null && m?.isExact} to="/">
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
                    {RoleDefinitions.userCanAccessAdminPage(userContext.roles) &&
                        <LinkContainer to="/RoleManagement">
                            <Nav.Link>Admin</Nav.Link>
                        </LinkContainer>}
                </Nav>
                <Nav className="justify-content-end">
                    <Persona className="mr-2 d-none d-md-inline-block" {...userContext.user} hidePersonaDetails size={PersonaSize.size32} />
                    <span className="user-title mr-2">{userContext.user?.Title}</span>
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    );
}