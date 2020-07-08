import React from "react";

export default function Icon({ color, name }) {
  switch (name) {
    case "add":
      return (
        <svg viewBox="0 0 24 24" fill={color}>
          <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
        </svg>
      );
    case "minus":
      return (
        <svg viewBox="0 0 24 24" fill={color}>
          <path d="M0 10h24v4h-24z" />
        </svg>
      );
    case "close":
      return (
        <svg viewBox="0 0 24 24" fill={color}>
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      );
  }
}
