### Added

- AvatarGroup: the `+N` counter has an accessible name ("3 more"). New label `moreAvatars`.

### Fixed

- FormField: the hint and error ids are added to the control's own `aria-describedby` instead of replacing it.
- AvatarGroup: a negative `max` no longer reports more hidden avatars than there are.
- ButtonGroup: only the corners between buttons are squared, so rounded buttons keep their pill shape at both ends.
