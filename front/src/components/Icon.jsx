import React from 'react';

const paths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v2" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  save: <><path d="M20 21H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h13l4 4v13a1 1 0 0 1-1 1Z" /><path d="M7 3v6h9V3M7 21v-8h10v8" /></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 1-3.7 1.7 1.7 0 0 1 1-3.3h2a3 3 0 0 0 3-3c0-4.4-4-8-9-8Z" /><path d="M7 11h.01M9 7h.01M14 6h.01M18 9h.01" /></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 5h4m-2 14h.01" /></>,
  window: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M7 6.5h.01m3 0h.01M7 13h5m-5 3h9" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 7h14M5 17h14" /></>,
  store: <path d="M4 10v11h16V10M3 7l2-4h14l2 4v3a3 3 0 0 1-4 0 3 3 0 0 1-5 0 3 3 0 0 1-5 0 3 3 0 0 1-4 0V7Zm0 0h18M9 21v-7h6v7" />,
  briefcase: <><rect x="3" y="7" width="18" height="14" rx="3" /><path d="M8 7V3h8v4M3 12a21 21 0 0 0 18 0M10 13v3h4v-3" /></>,
  links: <path d="m10 13 4-4m-6 6-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 2 1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0" transform="translate(1 1)" />,
  whatsapp: <><path d="M20 11.5a8.4 8.4 0 0 1-8.5 8.3 9 9 0 0 1-4-.9L3 20l1.2-4.3A8.2 8.2 0 0 1 3 11.5a8.5 8.5 0 0 1 17 0Z" /><path d="M8 7.4c-.8.6-.8 1.6-.1 2.9a10 10 0 0 0 4 4c1.3.7 2.2.7 2.9-.1l.5-.8-2.5-1.2-.8.8a7 7 0 0 1-2.7-2.7l.8-.8-1.2-2.5Z" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10.5v7m0-10v.1M11.5 17.5v-7m0 3a3 3 0 0 1 6 0v4" /></>,
  email: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  back: <path d="M19 12H5m5-5-5 5 5 5" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  up: <path d="m6 14 6-6 6 6" />,
  down: <path d="m6 10 6 6 6-6" />,
  edit: <path d="m14 4 6 6M4 20l5-1L21 7a2.8 2.8 0 0 0-4-4L5 15l-1 5Z" />,
  trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />,
  check: <path d="m5 12 4 4L19 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  share: <path d="M12 16V3m-4 4 4-4 4 4M4 13v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />,
  upload: <path d="M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></>,
  external: <path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />,
  brand: <><path d="M12 21V3m0 18L4 7m8 14L20 7M12 21 2 13m10 8 10-8" /><circle cx="12" cy="3" r="1.5" /><circle cx="4" cy="7" r="1.5" /><circle cx="20" cy="7" r="1.5" /><circle cx="2" cy="13" r="1.5" /><circle cx="22" cy="13" r="1.5" /></>
};

export default function Icon({ name, size = 22, className = '', ...props }) {
  return <svg className={`icon ${className}`.trim()} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.links}</svg>;
}
