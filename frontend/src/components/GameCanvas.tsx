import React, { useEffect, useRef } from "react";
import { canvasInterface } from "../lib/class/ClientP4";

interface GameCanvasProps {
	canvas_i: canvasInterface;
	setActivePlayer?: (playerNumber: number, active: boolean) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ canvas_i, setActivePlayer }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current && !containerRef.current.contains(canvas_i.element)) {
			containerRef.current.appendChild(canvas_i.element);
		}
		setActivePlayer(1, true);
	}, []);
	return <div ref={containerRef} className="game-canvas-container" />;
};

export default GameCanvas;
