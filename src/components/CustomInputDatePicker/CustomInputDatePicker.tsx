import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './CustomInputeDatePicker.css';

export interface ICustomInputeDatePickerProps {
    headerText: string,
    date: Moment,
    onChange: (date: Moment) => void
}

export const CustomInputeDatePicker: React.FunctionComponent<ICustomInputeDatePickerProps> = (props: ICustomInputeDatePickerProps) => {

    const [open, setOpen] = useState<boolean>(false);

    const onChange = (newDate: Date) => {
        props.onChange(moment(newDate));
    }

    const onClick = (inside: boolean) => {
        setOpen(inside);
    }

    const DatePickerCustomInput = () => (
        <>
            <Form.Label>{props.headerText}</Form.Label>
            <Form.Control
                type="text"
                value={props.date.format("DD MMM YYYY")}
                onClick={() => onClick(true)}
            />
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
        />
    );
}