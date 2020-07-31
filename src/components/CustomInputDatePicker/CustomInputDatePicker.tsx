import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './CustomInputeDatePicker.css';

export interface ICustomInputeDatePickerProps {
    headerText: string,
    readOnly: boolean,
    date: Moment,
    isValid?: boolean,
    isInvalid?: boolean,
    errorMessage?: string,
    onChange: (date: Moment) => void
}

export const CustomInputeDatePicker: React.FunctionComponent<ICustomInputeDatePickerProps> = (props: ICustomInputeDatePickerProps) => {

    const [open, setOpen] = useState<boolean>(false);

    const onChange = (newDate: Date) => {
        if (!props.readOnly) {
            props.onChange(moment(newDate));
        }
    }

    const onClick = (inside: boolean) => {
        if (!props.readOnly) {
            setOpen(inside);
        }
    }

    const DatePickerCustomInput = () => (
        <>
            <Form.Label>{props.headerText}</Form.Label>
            <Form.Control
                type="text"
                readOnly={props.readOnly}
                defaultValue={props.date.format("DD MMM YYYY")}
                onClick={() => onClick(true)}
                isValid={props.isValid}
                isInvalid={props.isInvalid}
            />
            <Form.Control.Feedback type="invalid">
                {props.errorMessage}
            </Form.Control.Feedback>
        </>);

    return (
        <DatePicker
            selected={props.date.toDate()}
            onChange={onChange}
            minDate={new Date()}
            customInput={<DatePickerCustomInput />}
            open={open}
            onClickOutside={() => onClick(false)}
            shouldCloseOnSelect={false}
            customInputRef="DatePickerCustomInput"
        />
    );
}