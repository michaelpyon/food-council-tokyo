# Changelog

All notable changes to Food Council: Tokyo are documented here.

## [0.1.1.0] - 2026-08-03

### Changed

- Expanded the public directory from 28 to 91 active, high-confidence, publicly accessible records by separating corrected or unpublished metadata findings from blocking audit risks.
- Kept the release gate fail-closed: unknown flags and unresolved operating, confidence, evidence, duplication, access, branch, successor, and identity problems remain held.
- Updated exact product counts, metadata, documentation, and social assets to 91 public, 72 held, and 163 audited.

### Fixed

- Made the Michelin filter show the selected neighborhood's available count and disable combinations that can’t return a result.
- Removed non-allowlisted HTTP evidence URLs from the public artifact while preserving public-safe direct sources.

## [0.1.0.0] - 2026-08-03

### Added

- Browse, search, filter, and sort a strict 28-place public directory generated from a 163-record branch-level audit.
- Review direct official, Michelin, and Tabelog evidence for every public place, with verification dates and truthful hold counts.
- Save verified places to My Trip, copy grouped evidence, and share trips through URLs that preserve current IDs and disclose legacy omissions.
- Run reproducible data, product-claim, accessibility, storage, interaction, and real-animation regression gates with enforced V8 coverage floors.

### Changed

- Rebuilt the interface around verification status, responsive mobile controls, keyboard-complete panels, reduced-motion support, and 44px interaction targets.
- Updated the brand, metadata, social image, documentation, and release copy to the 28 public, 135 held, 163 audited contract verified through July 30, 2026.
- Upgraded verified evidence links to direct HTTPS where the source supports it and documented the sole exact HTTP exception.

### Fixed

- Removed delayed exit animations that made filtered results appear empty or left large gaps.
- Prevented empty, legacy, malformed, or storage-blocked trip state from erasing saved places or crashing the app.
- Restored focus after animated evidence and My Trip transitions, including shared-trip entry paths.
- Hardened clipboard fallbacks, source labels, Michelin claims, mobile overflow, filter recovery, and deterministic test execution.

### Removed

- Removed restaurant photography, generated image placeholders, ratings, prices, descriptions, cuisine claims, reservation claims, and other unsupported enrichment from the public product.
- Removed dead scoring, score-badge, curated-list, and starter-list modules from the production source.
