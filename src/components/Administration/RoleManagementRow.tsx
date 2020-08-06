import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { IRole, IUserRoles, RoleType } from "../../api/RolesApi";
import { IPerson } from "../../api/UserApi";
import './Administration.css';


export interface IRoleManagementRowProps {
    roles: IUserRoles,
    submitRole: (user: IPerson, role: RoleType) => Promise<void>,
    deleteRole: (user: IPerson, role: IRole) => Promise<void>
}

export const RoleManagementRow: React.FunctionComponent<IRoleManagementRowProps> = (props) => {

    const [roleToSubmit, setRoleToSubmit] = useState<RoleType>();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    const updateRoleToSubmit = (value: string) => {
        let roleType = Object.values(RoleType).find(rt => value === rt);
        setRoleToSubmit(roleType);
    }

    const submitRole = async () => {
        try {
            setSubmitting(true);
            if (roleToSubmit) {
                await props.submitRole(props.roles.User, roleToSubmit);
            }
        } finally {
            setSubmitting(false);
        }
    }

    const deleteRole = async () => {
        try {
            setDeleting(true);
            let role = props.roles.Roles.find(r => r.Role === roleToSubmit);
            if (role) {
                await props.deleteRole(props.roles.User, role);
            }
        } finally {
            setDeleting(false);
        }
    }

    return (
        <tr>
            <td className="align-middle">{props.roles.User.Title}</td>
            <td className="align-middle">{props.roles.Roles.map((r, i, a) => i < a.length - 1 ? `${r.Role}, ` : r.Role)}</td>
            <td className="align-middle">
                <Form className="role-form">
                    <Form.Label>Role:</Form.Label>
                    <Form.Control
                        as="select"
                        value={roleToSubmit}
                        onChange={e => updateRoleToSubmit(e.target.value)}
                    >
                        <option value=''>--</option>
                        {Object.values(RoleType).map(rt => <option key={rt}>{rt}</option>)}
                    </Form.Control>
                </Form>
            </td>
            <td className="align-middle">
                <Button
                    block
                    variant="primary"
                    onClick={submitRole}
                    disabled={submitting || deleting || !roleToSubmit || props.roles.Roles.some(r => roleToSubmit === r.Role)}
                >
                    {submitting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                    {' '}{"Add Role"}
                </Button>
                <Button
                    block
                    variant="danger"
                    onClick={deleteRole}
                    disabled={submitting || deleting || !roleToSubmit || !props.roles.Roles.some(r => roleToSubmit === r.Role)}
                >
                    {deleting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                    {' '}{"Delete Role"}
                </Button>
            </td>
        </tr>
    );
}