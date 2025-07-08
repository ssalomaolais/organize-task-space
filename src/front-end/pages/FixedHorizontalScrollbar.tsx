import React, { useEffect, useRef, useState } from "react";

interface FixedHorizontalScrollbarProps {
    targetId: string;
}

const FixedHorizontalScrollbar: React.FC<FixedHorizontalScrollbarProps> = ({ targetId }) => {
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);
    const [barWidth, setBarWidth] = useState(0);

    useEffect(() => {
        const target = document.getElementById(targetId);
        const scrollbar = scrollbarRef.current;
        if (!target || !scrollbar) return;

        const updateBar = () => {
            setShow(target.scrollWidth > target.clientWidth);
            setBarWidth(target.scrollWidth);
        };

        const syncScroll = () => {
            scrollbar.scrollLeft = target.scrollLeft;
        };
        const syncTargetScroll = () => {
            target.scrollLeft = scrollbar.scrollLeft;
        };

        target.addEventListener("scroll", syncScroll);
        scrollbar.addEventListener("scroll", syncTargetScroll);
        window.addEventListener("resize", updateBar);
        updateBar();

        return () => {
            target.removeEventListener("scroll", syncScroll);
            scrollbar.removeEventListener("scroll", syncTargetScroll);
            window.removeEventListener("resize", updateBar);
        };
    }, [targetId]);

    if (!show) return null;

    return (
        <div
            ref={scrollbarRef}
            className="fixed-horizontal-scrollbar"
            style={{
                left: 0,
                bottom: 0,
                width: "100vw",
                height: 16,
                background: "#fff",
                borderTop: "1px solid #e5e7eb",
                zIndex: 50,
                overflowX: "auto",
                pointerEvents: "auto"
            }}
        >
            <div style={{ width: barWidth, height: 1 }} />
        </div>
    );
};

export default FixedHorizontalScrollbar; 