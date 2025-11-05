/// <reference types="vite/client" />

// RSS.app Widget Custom Element Declaration
declare namespace JSX {
  interface IntrinsicElements {
    'rssapp-wall': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { id: string }, HTMLElement>;
  }
}
