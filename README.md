# Velvet Essence

A responsive React wine-store portfolio, with an editorial design inspired by PepsiCo's large image panels, expressive typography and category browsing. Velvet keeps its own burgundy, blush and citrus visual identity.

## Run

```sh
npm ci
npm start
npm run lint
npm test -- --watchAll=false
npm run build
```

Uses the existing React 18, React Router, Redux Toolkit and Firebase architecture. Configure the host to rewrite application routes to `index.html` (including `/cart`, `/italy`, `/france`, `/spain` and `/new-world`).

## Implemented

- Responsive navigation, keyboard-accessible dialogs and language picker, reduced-motion support and local fonts.
- Eleven languages, gift baskets with selectable wines and a €10 basket supplement, and product quick views.
- Explicit “Nach oben” clicks use a 2.4-second eased scroll on every device, including reduced-motion settings; wheel, touch and keyboard input cancel it. Automatic animations still respect reduced motion.
- Search by name, grape or region; country and style filters; price/rating sorting; progressive catalogue display.
- Cart quantities, removal and guarded localStorage persistence.
- Live Firebase catalogue with a six-second timeout and a labelled bundled-data fallback.
- Order-request saving with pending, success and failure feedback. Failed requests keep the cart.

This is a portfolio demo: no payment, shipping, authentication or order-history flow is implemented. The order action only saves a request to the existing Firebase database. Production use requires server-validated pricing, inventory, authentication, database rules, payment and fulfilment integration. Existing product data and external images are retained; missing images display an accessible placeholder. Product facts should be reviewed before commercial use.

## Design verification

Check desktop and mobile browsing, keyboard navigation, mobile menu, combined filters, empty search results, adding/removing bottles, refresh persistence and failed order requests. Automated tests cover catalogue loading and fallback, filters, cart persistence, quick views, gift selection, translations, dialogs, ticker behavior and back-to-top scrolling. Run lint, tests and the production build before deploying.
