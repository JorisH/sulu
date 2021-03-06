// @flow
import React, {Fragment} from 'react';
import {Portal} from 'react-portal';
import {observer} from 'mobx-react';
import {action, computed, observable} from 'mobx';
import type {ElementRef, Node} from 'react';
import {afterElementsRendered} from '../../services/DOM';
import Backdrop from '../Backdrop';
import type {PopoverDimensions} from './types';
import PopoverPositioner from './PopoverPositioner';
import popoverStyles from './popover.scss';

type Props = {
    /** This element will be used to position the popover */
    anchorElement: ElementRef<*>,
    backdrop: boolean,
    centerChildElement?: ElementRef<*>,
    children?: (
        setPopoverElementRef: (ref: ElementRef<*>) => void,
        style: Object,
        verticalPosition: string,
        horizontalPosition: string,
    ) => Node,
    horizontalOffset: number,
    onClose?: () => void,
    open: boolean,
    popoverChildRef?: (ref: ?ElementRef<*>) => void,
    verticalOffset: number,
};

@observer
export default class Popover extends React.Component<Props> {
    static defaultProps = {
        backdrop: true,
        horizontalOffset: 0,
        open: false,
        verticalOffset: 0,
    };

    @observable popoverChildRef: ElementRef<*>;

    @observable popoverWidth: number;

    @observable popoverHeight: number;

    componentDidMount() {
        window.addEventListener('blur', this.close);
        window.addEventListener('resize', this.close);
    }

    componentWillUnmount() {
        window.removeEventListener('blur', this.close);
        window.removeEventListener('resize', this.close);
    }

    componentDidUpdate() {
        if (this.popoverChildRef) {
            this.updateDimensions();

            afterElementsRendered(() => {
                this.popoverChildRef.scrollTop = this.dimensions.scrollTop;
            });
        }
    }

    close = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    @computed get dimensions(): PopoverDimensions {
        const {
            anchorElement,
            verticalOffset,
            horizontalOffset,
            centerChildElement,
        } = this.props;
        const {
            top = 0,
            left = 0,
            width = 0,
            height = 0,
        } = anchorElement.getBoundingClientRect();
        const centerChildOffsetTop = (centerChildElement) ? centerChildElement.offsetTop : 0;
        const alignOnVerticalAnchorEdges = !centerChildElement;

        return PopoverPositioner.getCroppedDimensions(
            this.popoverWidth,
            this.popoverHeight,
            top,
            left,
            width,
            height,
            horizontalOffset,
            verticalOffset,
            centerChildOffsetTop,
            alignOnVerticalAnchorEdges
        );
    }

    updateDimensions = () => {
        if (!this.popoverChildRef) {
            return;
        }

        const {
            offsetWidth,
            offsetHeight,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight,
        } = this.popoverChildRef;

        // calculating real size by considering borders, margins and paddings
        const outerWidth = scrollWidth + offsetWidth - clientWidth;
        const outerHeight = scrollHeight + offsetHeight - clientHeight;

        this.setPopoverSize(
            outerWidth,
            outerHeight
        );
    };

    @action setPopoverSize(width: number, height: number) {
        this.popoverWidth = width;
        this.popoverHeight = height;
    }

    handleBackdropClick = this.close;

    @action setPopoverChildRef = (ref: ElementRef<*>) => {
        if (ref) {
            this.popoverChildRef = ref;
        }

        const {popoverChildRef} = this.props;
        if (popoverChildRef) {
            popoverChildRef(ref);
        }
    };

    render() {
        const {
            open,
            children,
            anchorElement,
            backdrop,
        } = this.props;

        if (!open || !anchorElement) {
            return null;
        }

        const dimensions = this.dimensions;
        const styles = {
            ...PopoverPositioner.dimensionsToStyle(dimensions),
            position: 'fixed',
            pointerEvents: 'auto',
        };

        const verticalPosition = (dimensions.top > anchorElement.getBoundingClientRect().top) ? 'bottom' : 'top';
        const horizontalPosition = (dimensions.left === anchorElement.getBoundingClientRect().left) ? 'left' : 'right';

        return (
            <Fragment>
                {backdrop &&
                    <Backdrop onClick={this.handleBackdropClick} open={true} visible={false} />
                }
                <Portal>
                    <div className={popoverStyles.container}>
                        {children &&
                            children(this.setPopoverChildRef, styles, verticalPosition, horizontalPosition)
                        }
                    </div>
                </Portal>
            </Fragment>
        );
    }
}
