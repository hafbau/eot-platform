"use client";
import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

interface ToasterPropsExtended extends Omit<ToasterProps, "theme"> {
  theme?: "light" | "dark" | "system"
}

const Toaster = ({
  ...props
}: ToasterPropsExtended) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)"
        } as React.CSSProperties
      }
      {...props} />
  );
}

export { Toaster }
