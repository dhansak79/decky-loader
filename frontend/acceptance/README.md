# Browser acceptance examples

These tests run the real plugin importer inside a small browser-rendered Steam
Quick Access shell. Playwright interacts with the shell through user-visible
roles and text rather than calling importer functions from the test process.

The shell deliberately simulates Steam-specific globals and plugin transport
outcomes. It provides fast acceptance coverage in ordinary CI, but it does not
emulate Steam Client CEF, Gamescope, controller input, or SteamOS. A separate
hardware-in-the-loop suite would still be needed for those boundaries.

Run the examples with:

```sh
pnpm exec playwright install chromium
pnpm test:acceptance
```

The suite writes a self-contained HTML report to `playwright-report/`.
Screenshots are captured for every journey; videos and traces are retained for
failed journeys. CI uploads the report and raw results as one downloadable
artifact even when the test step fails.
