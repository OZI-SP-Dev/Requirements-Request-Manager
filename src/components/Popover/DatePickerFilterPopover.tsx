import moment from "moment";
import { Moment } from "moment";
import React, { FunctionComponent, useState } from "react";
import { Form } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/Overlay";
import { FilterValue } from "../../api/RequirementsRequestsApi";
import { CustomInputeDatePicker } from "../CustomInputDatePicker/CustomInputDatePicker";
import { FilterPopover } from "./FilterPopover";


export interface DatePickerFilterPopoverProps {
    show: boolean,
    target: any,
    titleText: string,
    placement?: Placement,
    onSubmit: (filterValue: FilterValue) => void,
    clearFilter(): void,
    handleClose: () => void
}

export const DatePickerFilterPopover: FunctionComponent<DatePickerFilterPopoverProps> = (props) => {

    const [startDate, setStartDate] = useState<Moment | null>(null);
    const [endDate, setEndDate] = useState<Moment | null>(null);

    const onClear = () => {
        setStartDate(null);
        setEndDate(null);
        props.clearFilter();
    }

    return (
        <FilterPopover {...props} onSubmit={() => props.onSubmit({ start: startDate, end: endDate })} clearFilter={onClear}>
            <Form className="date-picker-filter">
                <CustomInputeDatePicker
                    headerText="Start Date:"
                    readOnly={false}
                    date={startDate}
                    maxDate={endDate ? endDate : moment()}
                    onChange={date => setStartDate(date)}
                />
                <CustomInputeDatePicker
                    headerText="End Date:"
                    readOnly={false}
                    date={endDate}
                    minDate={startDate ? startDate : undefined}
                    maxDate={moment()}
                    onChange={date => setEndDate(date)}
                />
            </Form>
        </FilterPopover>
    );

}