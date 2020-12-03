import React, { FunctionComponent, useRef } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { Placement } from "react-bootstrap/Overlay";
import { useOutsideClickDetect } from "../../hooks/useOutsideClickDetect";

export interface ConfirmPopoverProps {
    show: boolean,
    target: any,
    placement: Placement,
    titleText: string,
    handleClose: () => void
}

export const InfoPopover: FunctionComponent<ConfirmPopoverProps> = (props) => {

    const wrapperRef = useRef(null);
    useOutsideClickDetect(wrapperRef, props.handleClose);

    return (
        <Overlay
            show={props.show}
            placement={props.placement}
            target={props.target}
        >
            <Popover id={"confirm-popover"}>
                <div ref={wrapperRef}>
                    <Popover.Title as="h3">{props.titleText}</Popover.Title>
                    <Popover.Content>
                        {props.children}
                    </Popover.Content>
                </div>
            </Popover>
        </Overlay>
    );

}