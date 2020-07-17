import React from 'react';
import { Spinner } from 'react-bootstrap';
import './RequestSpinner.css'

export interface IRequestSpinnerProps {
    show: boolean
}

export const RequestSpinner: React.FunctionComponent<IRequestSpinnerProps> = (props) => {

    return (
        <>
            {props.show &&
                <div className="spinner">
                    <Spinner animation="border" role="status" />
                </div>}
        </>
    );
}

export default RequestSpinner;