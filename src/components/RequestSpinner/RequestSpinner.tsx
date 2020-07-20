import React from 'react';
import { Spinner } from 'react-bootstrap';
import './RequestSpinner.css'

export interface IRequestSpinnerProps {
    show: boolean,
    displayText: string
}

export const RequestSpinner: React.FunctionComponent<IRequestSpinnerProps> = (props) => {

    return (
        <>
            {props.show &&
                <div className="spinner">
                    <Spinner animation="border" role="status" />
                    <span><br />{props.displayText}</span>
                </div>}
        </>
    );
}

export default RequestSpinner;