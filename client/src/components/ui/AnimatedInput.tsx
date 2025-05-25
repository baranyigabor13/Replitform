// client/src/components/ui/AnimatedInput.tsx
import React, { forwardRef } from "react";
import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ForwardedRef,
} from "react";
import { cn } from "@/lib/utils";

const colorStyles = {
  blue: "border-neon-blue border-opacity-30 focus:border-opacity-100 focus:ring-neon-blue text-neon-blue",
  purple: "border-neon-purple border-opacity-30 focus:border-opacity-100 focus:ring-neon-purple text-neon-purple",
  green: "border-neon-green border-opacity-30 focus:border-opacity-100 focus:ring-neon-green text-neon-green",
} as const;

type ColorName = keyof typeof colorStyles;

interface BaseAnimatedInputProps {
  label?: string;
  error?: string;
  color?: ColorName;
}

type AnimatedInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "color"
> &
  BaseAnimatedInputProps;

type AnimatedTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "color"
> &
  BaseAnimatedInputProps & { rows?: number };

export const AnimatedInput = forwardRef(
  (props: AnimatedInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      className = "",
      label,
      color = "blue",
      error,
      ...rest
    } = props;

    const styles = colorStyles[color];

    return (
      <div className="relative">
        {label && (
          <label
            className={`block text-lg font-medium mb-3 ${
              styles.split(" ").pop()
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            {...rest}
            ref={ref}
            className={cn(
              "w-full bg-cyber-dark-alt glass px-5 py-4 rounded-lg",
              "border focus:outline-none focus:ring-2 focus:ring-opacity-30",
              "transition-all duration-300",
              styles,
              error && "border-red-500",
              className
            )}
          />
          <div
            className={cn(
              "absolute inset-0 rounded-lg pointer-events-none opacity-0 hover:opacity-20",
              `bg-gradient-to-r from-transparent via-${
                color === "blue"
                  ? "neon-blue"
                  : color === "purple"
                  ? "neon-purple"
                  : "neon-green"
              } to-transparent bg-size-200 animate-gradient-x`
            )}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export const AnimatedTextarea = forwardRef(
  (props: AnimatedTextareaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const {
      className = "",
      label,
      color = "blue",
      error,
      rows = 3,
      ...rest
    } = props;

    const styles = colorStyles[color];

    return (
      <div className="relative">
        {label && (
          <label
            className={`block text-lg font-medium mb-3 ${
              styles.split(" ").pop()
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            {...rest}
            ref={ref}
            rows={rows}
            className={cn(
              "w-full bg-cyber-dark-alt glass px-5 py-4 rounded-lg",
              "border focus:outline-none focus:ring-2 focus:ring-opacity-30",
              "transition-all duration-300",
              styles,
              error && "border-red-500",
              className
            )}
          />
          <div
            className={cn(
              "absolute inset-0 rounded-lg pointer-events-none opacity-0 hover:opacity-20",
              `bg-gradient-to-r from-transparent via-${
                color === "blue"
                  ? "neon-blue"
                  : color === "purple"
                  ? "neon-purple"
                  : "neon-green"
              } to-transparent bg-size-200 animate-gradient-x`
            )}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

AnimatedTextarea.displayName = "AnimatedTextarea";
