"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  label?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("NUSTream component failure", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <section className="grid min-h-[280px] place-items-center rounded-[1.5rem] border border-white/20 bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl dark:bg-nust-dark/70">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
            {this.props.label || "NUSTream"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-nust-blue dark:text-blue-300">
            Oops, a component crashed.
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-300">
            Click to reload this part of the experience.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[1.15rem] bg-nust-blue px-5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.05] hover:bg-nust-dark active:scale-95"
          >
            Reload component
          </button>
        </div>
      </section>
    );
  }
}

