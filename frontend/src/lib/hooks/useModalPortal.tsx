"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Modal from "@/components/Modal";

export interface UseModalPortalOptions {
	title?: string;
	content: React.ReactNode;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	scrollable?: boolean;
	onClose?: () => void;
	confirm?: () => void | Promise<void>;
}

export interface UseModalPortalReturn {
	isOpen: boolean;
	modal: React.ReactNode;
	open: () => void;
	close: () => void;
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
				content={options.content}
				size={options.size}
				scrollable={options.scrollable}
				onConfirm={options.confirm}
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
		]
	);

	return {
		isOpen,
		modal,
		open,
		close,
	};
}
