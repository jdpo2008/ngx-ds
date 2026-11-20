### Fixed

- Modal, Drawer and Lightbox: a closed overlay no longer resets the page's `overflow`, and closing one gives back the `overflow` the page had before.
- Modal, Drawer and Lightbox: with one overlay open over another (a modal over a drawer, a lightbox over a modal), closing the top one keeps the page scroll locked, and Escape closes only the top one.
- Stepper: clicking the current step no longer emits `stepChange`, and `goTo()` ignores an index outside the steps.
