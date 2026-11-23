### Fixed

- Splitter: `resizeEnd` is no longer emitted when a key leaves the size unchanged (for example ArrowLeft at `min`).
- Carousel: an empty `items` list no longer produces a negative slide index and an invalid track transform.
- Carousel: when an arrow becomes disabled at the end of a non-looping carousel, focus moves to the other arrow instead of being lost.
