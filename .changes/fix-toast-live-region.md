### Fixed

- Toast: the position containers now stay in the page as polite live regions, so screen readers announce new toasts. Before, each container was created together with its first toast, and many screen readers ignored it. Error toasts keep `role="alert"`; the other types no longer carry `role="status"`.
