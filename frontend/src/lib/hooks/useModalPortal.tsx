"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Modal from "@/components/Modal";

export interface UseModalPortalContext {
	close: () => void;
}

export type UseModalPortalContent =
	| React.ReactNode
	| ((ctx: UseModalPortalContext) => React.ReactNode);

export interface UseModalPortalOptions {
	title?: string;
	content: UseModalPortalContent;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	scrollable?: boolean;
	onClose?: () => void;
	confirm?: () => void | Promise<void>;
	closable?: boolean;
}

export interface UseModalPortalReturn {
	isOpen: boolean;
	modal: React.ReactNode;
	open: () => void;
	close: () => void;
}

function ContentRenderer({
	content,
	onClose,
}: {
	content: UseModalPortalContent;
	onClose: () => void;
}) {
	if (typeof content === "function") {
		return <>{content({ close: onClose })}</>;
	}
	return <>{content}</>;
}

export function useModalPortal(options: UseModalPortalOptions): UseModalPortalReturn {
	const [isOpen, setIsOpen] = useState(false);
	const optionsRef = useRef(options);

	// Mise à jour des options quand elles changent
	useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	const open = useCallback(() => {
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		if (optionsRef.current.onClose) {
			optionsRef.current.onClose();
		}
	}, []);

	const modal = useMemo(
		() => (
			<Modal
				open={isOpen}
				onClose={close}
				title={options.title}
				content={<ContentRenderer content={options.content} onClose={close} />}
				size={options.size}
				scrollable={options.scrollable}
				onConfirm={options.confirm}
				closable={options.closable}
			/>
		),
		[
			isOpen,
			close,
			options.title,
			options.content,
			options.size,
			options.scrollable,
			options.confirm,
			options.closable,
		]
	);

	return {
		isOpen,
		modal,
		open,
		close,
	};
}
