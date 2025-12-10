import React from "react";

interface OffCanvasProps {
	show?: boolean;
	onHide?: () => void;
	header?: React.ReactNode;
	children?: React.ReactNode;
	placement?: "start" | "end" | "top" | "bottom";
}

const OffCanvas: React.FC<OffCanvasProps> = ({ show, onHide, header, children, placement = "start" }) => {
	return (
		<div className={`offcanvas offcanvas-${placement} ${show ? "show" : ""}`} tabIndex={-1} style={{ visibility: show ? "visible" : "hidden" }} aria-modal="true" role="dialog">
			<div className="offcanvas-header">
				{header}
				<button type="button" className="btn-close" onClick={onHide} />
			</div>
			<div className="offcanvas-body">{children}</div>
		</div>
	);
};

export default OffCanvas;
