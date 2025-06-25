# Changelog

All notable changes will be documented in this file following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) guidelines and [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2025-06-24
### Added
- Supabase env-variable guard with graceful fallback (& stub client).
- Offline-safe authentication initialization timeout logic.
- Fallback UI `MissingEnvScreen` displayed when config absent.
- Jest setup (`ts-jest`) and first unit test validating env guard.

### Changed
- Updated `useAuth` to short-circuit when backend not configured.
- Updated `App.tsx` to show fallback screen.
- Added test script & dependencies to `package.json`.

### Fixed
- Fixes #B-1: App no longer crashes on missing env vars.
- Fixes #B-2: Spinner timeout prevents infinite loading when offline.

- Initial documentation & roadmap generated (System Audit).
