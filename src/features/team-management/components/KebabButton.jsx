import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export default function KebabButton({ items = [], align = "right" }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  function toggle(event) {
    if (open) {
      setOpen(false);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const estimatedMenuHeight = items.length * 40 + 12;

    const top =
      rect.bottom + 4 + estimatedMenuHeight > window.innerHeight
        ? Math.max(8, rect.top - estimatedMenuHeight)
        : rect.bottom + 4;

    setPosition({
      top,
      left: rect.left,
      right: window.innerWidth - rect.right,
    });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleScroll() {
      setOpen(false);
    }

    function handleResize() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
        aria-label="Row actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: position.top,
              ...(align === "right"
                ? { right: position.right }
                : { left: position.left }),
            }}
            className="z-50 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                  item.danger ? "text-red-500" : "text-slate-600"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
