import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Spinner, Table } from "react-bootstrap";
import { RoleType } from "../../api/RolesApi";
import { IPerson, Person } from "../../api/UserApi";
import { useRoles } from "../../hooks/useRoles";
import { PeoplePicker } from "../PeoplePicker/PeoplePicker";
import RequestSpinner from "../RequestSpinner/RequestSpinner";
import './Administration.css';
import { RoleManagementRow } from "./RoleManagementRow";

export const Administration: React.FunctionComponent = () => {

    const [newUser, setNewUser] = useState<IPerson>();
    const [newRole, setNewRole] = useState<RoleType>();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const roles = useRoles();

    const updateNewRole = (value: string) => {
        let roleType = Object.values(RoleType).find(rt => value === rt);
        setNewRole(roleType);
    }

    const submitRole = async () => {
        try {
            setSubmitting(true);
            if (newRole && newUser) {
                await roles.submitRole(newUser, newRole);
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>Site Administration</h1>
            <Form className="role-form">
                <Col className="float-left mt-2 mb-2" xl="4" lg="4" md="6" sm="6" xs="12">
                    <Form.Label>User:</Form.Label>
                    <Form.Control
                        as={PeoplePicker}
                        updatePeople={(p: IPerson[]) => {
                            let persona = p[0];
                            setNewUser(persona ? new Person(persona) : new Person());
                        }}
                        itemLimit={1}
                        required
                    />
                </Col>
                <Col className="float-left mt-2 mb-2" xl="4" lg="4" md="6" sm="6" xs="12">
                    <Form.Label>Role:</Form.Label>
                    <Form.Control
                        as="select"
                        value={newRole}
                        onChange={e => updateNewRole(e.target.value)}
                    >
                        <option value=''>--</option>
                        {Object.values(RoleType).map(rt => <option key={rt}>{rt}</option>)}
                    </Form.Control>
                </Col>
                <Col className="float-left mt-2 mb-2" xl="12" lg="12" md="12" sm="12" xs="12">
                    <Button
                        variant="primary"
                        className="float-left"
                        onClick={submitRole}
                        disabled={submitting || !newUser || !newRole}
                    >
                        {submitting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                        {' '}{"Add Role"}
                    </Button>
                </Col>
            </Form>
            <Table bordered striped hover responsive>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Roles</th>
                        <th colSpan={2}>Manage Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.roles.map(role =>
                        <RoleManagementRow
                            key={role.User.Id}
                            roles={role}
                            submitRole={roles.submitRole}
                            deleteRole={roles.deleteRole}
                        />
                    )}
                </tbody>
            </Table>
            {roles.error &&
                <Col className="fixed-bottom"
                    xl={{ span: 6, offset: 3 }}
                    lg={{ span: 6, offset: 3 }}
                    md={{ span: 8, offset: 2 }}
                    sm={{ span: 10, offset: 1 }}
                    xs={12}
                >
                    <Alert variant="danger" onClose={() => roles.clearError()} dismissible>
                        <Alert.Heading>Error!</Alert.Heading>
                        <p>{roles.error}</p>
                    </Alert>
                </Col>
            }
            <RequestSpinner show={roles.loading} displayText="Loading Roles..." />
        </Container>
    )
}