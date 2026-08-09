/* Every page is prerendered: this is a docs site with no server. `strict: true` in the adapter
   means a route that cannot prerender fails the build rather than shipping an empty shell. */
export const prerender = true;
