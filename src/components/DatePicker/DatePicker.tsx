import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

export interface IDatePickerProps {
    headerText: string,
    readOnly: boolean,
    date: Moment | null,
    min?: Moment,
    max?: Moment,
    isValid?: boolean,
    isInvalid?: boolean,
    errorMessage?: string,
    required?: boolean,
    onChange: (date: Moment | null) => void
}

export const DatePicker: React.FunctionComponent<IDatePickerProps> = (props: IDatePickerProps) => {

    const FORMAT: string = "yyyy-MM-DD";

    const onChange = (newDate: string | null) => {
        if (!props.readOnly) {
            props.onChange(newDate ? moment(newDate).utc().startOf('day') : null);
        }
    }

    return (
        <>
            <Form.Label className={`${props.required ? "required" : ""}`}>{props.headerText}</Form.Label>
            <Form.Control
                type="date"
                readOnly={props.readOnly}
                value={props.date ? props.date.format(FORMAT) : undefined}
                onChange={e => onChange(e.target.value)}
                min={props.min ? props.min.format(FORMAT) : undefined}
                max={props.max ? props.max.format(FORMAT) : undefined}
                isValid={props.isValid}
                isInvalid={props.isInvalid}
            />
            <Form.Control.Feedback type="invalid">
                {props.errorMessage}
            </Form.Control.Feedback>
        </>
    );
}