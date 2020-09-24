import React, { FunctionComponent, useRef, useState } from "react";
import { Button, Overlay, Popover, Spinner } from "react-bootstrap";
import { useOutsideClickDetect } from "../../hooks/useOutsideClickDetect";

export interface ConfirmPopoverProps {
    show: boolean,
    target: any,
    variant: "primary" | "danger",
    titleText: string,
    confirmationText: string,
    onSubmit: () => Promise<any>,
    handleClose: () => void
}

export const ConfirmPopover: FunctionComponent<ConfirmPopoverProps> = (props) => {

    const [submitting, setSubmitting] = useState<boolean>(false);
    const wrapperRef = useRef(null);
    useOutsideClickDetect(wrapperRef, props.handleClose);

    const handleSubmit = async () => {
        setSubmitting(true);
        await props.onSubmit();
        setSubmitting(false);
        props.handleClose();
    }

    return (
        <Overlay
            show={props.show}
            placement="top"
            target={props.target}
        >
            <Popover id={"confirm-popover"}>
                <div ref={wrapperRef}>
                    <Popover.Title as="h3">{props.titleText}</Popover.Title>
                    <Popover.Content>
                        <p>{props.confirmationText}</p>
                        <Button
                            className="float-left mb-2"
                            variant="secondary"
                            onClick={props.handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="float-right mb-2"
                            disabled={submitting}
                            variant={props.variant}
                            onClick={handleSubmit}
                        >
                            {submitting && <Spinner as="span" size="sm" animation="grow" role="status" aria-hidden="true" />}
                            {' '}Confirm
                        </Button>
                    </Popover.Content>
                </div>
            </Popover>
        </Overlay>
    );

}