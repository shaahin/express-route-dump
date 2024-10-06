export async function dumpRoutes(app, basePath = '', aliases = {}) {
  const routes = {};

  const extractRoutePath = (regexp, keys) => {
    // Generate the full route path, using the keys array for named parameters
    let route = regexp.source
      .replace(/\\\//g, '/') // Replace escaped slashes
      .replace(/\(\?:\(\[\^\\\/]\+\?\)\)/g, ':param') // Replace anonymous parameters with :param
      .replace(/\^|\$$/g, ''); // Remove start and end anchors

    keys.forEach((key) => {
      route = route.replace(':param', `:${key.name}`); // Replace :param with actual param names
    });

    route = route.replaceAll('?(?=/|$)', ''); // Remove unwanted regex artifacts
    return route;
  };

  const processStack = (stack, basePath) => {
    stack.forEach((middleware) => {
      if (middleware.route) {
        // Route middleware (GET, POST, etc.)
        const methods = Object.keys(middleware.route.methods).map((method) =>
          method.toUpperCase(),
        );

        const fullPath = (basePath + middleware.route.path).replaceAll('//', '/');

        // Determine the second-level child path
        const segments = basePath.split('/').filter(Boolean); // Filter out empty segments
        const secondLevelPath = segments.length > 1 ? `/${segments[1]}` : '/'; // Get the second level

        // Initialize the second level group if it doesn't exist
        if (!routes[secondLevelPath]) {
          routes[secondLevelPath] = [];
        }

        // Push the route to the appropriate second level group
        routes[secondLevelPath].push({
          Method: methods.join(', '),
          Path: fullPath,
        });
      } else if (middleware.name === 'router' && middleware.regexp) {
        // Nested router with possible parameters
        const keys = middleware.keys || []; // Get parameter keys (if any)
        const newBasePath = basePath + extractRoutePath(middleware.regexp, keys);
        processStack(middleware.handle.stack, newBasePath);
      }
    });
  };

  processStack(app._router.stack, basePath);

  // Print in a structured format
  Object.entries(routes).forEach(([parent, routeList]) => {
    const alias = aliases[parent] ?? parent; // Get the alias or default to the parent path
    console.log(`Routes under: ${alias}`);
    console.table(routeList);
  });
}