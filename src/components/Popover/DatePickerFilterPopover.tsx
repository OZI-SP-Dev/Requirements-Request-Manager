import moment from "moment";
import { Moment } from "moment";
import React, { FunctionComponent, useState } from "react";
import { Form } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/Overlay";
import { FilterValue } from "../../api/RequirementsRequestsApi";
import { DatePicker } from "../DatePicker/DatePicker";
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
                <DatePicker
                    headerText="Start Date:"
                    readOnly={false}
                    date={startDate}
                    max={endDate ? endDate : undefined}
                    onChange={date => setStartDate(date)}
                />
                <DatePicker
                    headerText="End Date:"
                    readOnly={false}
                    date={endDate}
                    min={startDate ? startDate : undefined}
                    onChange={date => setEndDate(date)}
                />
            </Form>
        </FilterPopover>
    );

}