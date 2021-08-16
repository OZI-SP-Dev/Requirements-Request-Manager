import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './CustomInputeDatePicker.css';

export interface ICustomInputeDatePickerProps {
    headerText: string,
    readOnly: boolean,
    date: Moment | null,
    minDate?: Moment,
    maxDate?: Moment,
    isClearable?: boolean,
    isValid?: boolean,
    isInvalid?: boolean,
    errorMessage?: string,
    onChange: (date: Moment | null) => void
}

export const CustomInputeDatePicker: React.FunctionComponent<ICustomInputeDatePickerProps> = (props: ICustomInputeDatePickerProps) => {

    const [open, setOpen] = useState<boolean>(false);

    const onChange = (newDate: Date | null) => {
        if (!props.readOnly) {
            props.onChange(newDate ? moment(newDate) : null);
        }
    }

    const onClick = (inside: boolean) => {
        if (!props.readOnly) {
            setOpen(inside);
        }
    }

    const DatePickerCustomInput = () => (
        <>
            <Form.Label className={`${props.isClearable ? '' : "required"}`}>{props.headerText}</Form.Label>
            <Form.Control
                type="text"
                readOnly={props.readOnly}
                defaultValue={props.date ? props.date.format("DD MMM YYYY") : undefined}
                onFocus={() => onClick(true)}
                isValid={props.isValid}
                isInvalid={props.isInvalid}
            />
            <Form.Control.Feedback type="invalid">
                {props.errorMessage}
            </Form.Control.Feedback>
        </>);

    return (
        <DatePicker
            selected={props.date ? props.date.toDate() : undefined}
            onChange={onChange}
            minDate={props.minDate ? props.minDate.toDate() : undefined}
            maxDate={props.maxDate ? props.maxDate.toDate() : undefined}
            customInput={<DatePickerCustomInput />}
            open={open}
            onClickOutside={() => onClick(false)}
            shouldCloseOnSelect={false}
            customInputRef="DatePickerCustomInput"
            isClearable={props.isClearable}
        />
    );
}