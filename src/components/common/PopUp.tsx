import React, { ReactElement, FC } from "react";
import Popup from "reactjs-popup";
import { PopupPosition } from "reactjs-popup/dist/types";
import "reactjs-popup/dist/index.css";

type Props = {
  content: ReactElement;
  trigger: ReactElement;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onHover?: boolean;
  position?: PopupPosition;
  className?: string;
};

const PopUp: FC<Props> = ({
  content,
  trigger,
  isOpen,
  onClose,
  onOpen,
  onHover,
  position,
  className,
}) => (
  <Popup
    trigger={trigger}
    position={position ? position : "bottom center"}
    closeOnDocumentClick
    open={isOpen}
    onClose={onClose}
    onOpen={onOpen}
    arrow
    on={onHover ? ["hover", "focus"] : ["click"]}
    className={className}
  >
    {content}
  </Popup>
);

export default PopUp;
