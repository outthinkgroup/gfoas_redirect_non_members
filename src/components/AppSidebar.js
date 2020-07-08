import React, { useState, useLayoutEffect, useRef } from "react";

export default function AppSidebar({ save, saving }) {
  const [isFixed, setIsFixed] = useState(false);
  const box = useRef(null);
  const column = useRef(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useLayoutEffect(() => {
    const cb = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", cb);
    return () => {
      window.removeEventListener("resize", cb);
    };
  }, []);
  useLayoutEffect(() => {
    if (!column) return;
    setBoxWidth(column.current.getBoundingClientRect().width);
  }, [windowWidth, column]);
  useLayoutEffect(() => {
    const options = {
      rootMargin: "0px",
      threshold: [0, 0.05, 0.1, 0.15, 0.2, 1.0],
    };
    function callback(entries) {
      entries.forEach(({ boundingClientRect }) => {
        if (boundingClientRect.top <= 0) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      });
    }
    const observer = new IntersectionObserver(callback, options);
    const target = box.current;
    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, []);

  return (
    <div className="util-column" ref={column}>
      <div ref={box} style={{ marginTop: "-42px", paddingTop: `42px` }}>
        <div
          className="cloudbox"
          style={{
            position: isFixed ? `fixed` : `unset`,
            width: isFixed ? `${boxWidth}px` : `100%`,
            top: isFixed ? `42px` : `unset`,
          }}
        >
          <h3>Save Your Redirects</h3>
          <button type="button" className="primary-button" onClick={save}>
            Sav{saving ? "ing" : "e"}
          </button>
        </div>
      </div>
    </div>
  );
}
