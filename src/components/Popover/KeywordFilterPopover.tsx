import React from "react";
import { FunctionComponent, useState } from "react";
import { Form } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/Overlay";
import { FilterValue } from "../../api/RequirementsRequestsApi";
import { FilterPopover } from "./FilterPopover";


export interface KeywordFilterPopoverProps {
    show: boolean,
    target: any,
    titleText: string,
    placeHolderText?: string,
    placement?: Placement,
    containsCheck?: boolean,
    startsWithCheck?: boolean,
    onSubmit: (filterValue: FilterValue, isStartsWith?: boolean) => void,
    clearFilter(): void,
    handleClose: () => void
}

export const KeywordFilterPopover: FunctionComponent<KeywordFilterPopoverProps> = (props) => {

    const [keyword, setKeyword] = useState<string>('');
    const [isStartsWith, setIsStartsWith] = useState<boolean>(false);

    const onClear = () => {
        setKeyword('');
        setIsStartsWith(false);
        props.clearFilter();
    }

    return (
        <FilterPopover {...props} onSubmit={() => props.onSubmit(keyword.trim(), isStartsWith)} clearFilter={onClear}>
            <Form>
                {props.containsCheck || props.containsCheck === undefined && <Form.Check
                    type="radio"
                    id="contains-radio"
                    label="Contains"
                    checked={!isStartsWith}
                    onChange={() => setIsStartsWith(false)}
                />}
                {props.startsWithCheck || props.startsWithCheck === undefined && <Form.Check
                    type="radio"
                    id="starts-with-radio"
                    label="Starts With"
                    checked={isStartsWith}
                    onChange={() => setIsStartsWith(true)}
                />}
                <Form.Control
                    type="text"
                    value={keyword}
                    placeholder={props.placeHolderText}
                    onChange={e => setKeyword(e.target.value)}
                />
            </Form>
        </FilterPopover>
    );

}