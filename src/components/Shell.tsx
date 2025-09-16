"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Shell(props: Props) {
  return (
    <div
      style={{
        maxWidth: 420,          /* ancho de tarjeta móvil */
        margin: "0 auto",
        padding: "16px",
      }}
    >
      {props.title ? (
        <div className="row" style={{ gap: 8, marginBottom: 8 }}>
          <div className="logo-q">Q</div>
          <b style={{ fontSize: 20 }}>{props.title}</b>
        </div>
      ) : null}
      {props.children}
    </div>
  );
}