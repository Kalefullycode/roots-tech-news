/// <reference types="@cloudflare/workers-types" />

// Alias endpoint for /api/newsletter/subscribe
// This provides a shorter URL for newsletter subscriptions
export { onRequestPost } from './newsletter/subscribe';

