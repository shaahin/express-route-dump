# RouteDumper

RouteDumper is an Express middleware utility that allows you to easily extract and display all the routes defined in your Express application. It organizes the routes based on their second-level paths, making it easier to understand the structure of your API.

## Features

- Displays routes grouped by their second-level path.
- Supports named parameters in route definitions.
- Customizable route grouping with aliases.

## Installation

To install RouteDumper, use npm:

```bash
npm install express-route-dumper
```

## Usage

### Basic Example

Here is a basic example of how to use RouteDumper in your Express application:

```javascript
import express from 'express'
import dumpRoutes from 'express-route-dumper'

const app = express()

// Define some routes
app.get('/api/organization-section/:orgId/posts/:postId', (req, res) => res.send('post route'))
app.post('/api/organization-section/:orgId/posts', (req, res) => res.send('Create post'))
app.get('/api/organization-section/:orgId/documents', (req, res) => res.send('Documents route'))
app.post('/api/academy-section/:acyId/posts', (req, res) => res.send('Create post for academy-section'))

// Define aliases for the roots
const aliases = {
  '/api/organization-section': 'Organization API',
  '/api/academy-section': 'Academy API',
}

// Dump the routes with categorization
dumpRoutes(app, '', aliases)

app.listen(3000, () => console.log('Server running on port 3000'))
```

### Customizing Aliases

You can customize how routes are displayed by providing an `aliases` object. This object maps the base paths of your routes to more friendly names:

```javascript
const aliases = {
  '/api/organization-section': 'Organization API',
  '/api/academy-section': 'Academy API',
}
```

## API

### `dumpRoutes(app, basePath = '', aliases = {})`

- **Parameters**:
  - `app`: The Express application instance.
  - `basePath`: The base path for the routes (default is an empty string).
  - `aliases`: An object for custom route aliases.

- **Description**: This method processes the routes defined in the Express application and prints them in a structured format grouped by their second-level paths.

## License

This project is licensed under the [GNU License](LICENSE).

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please submit a pull request or open an issue.

## Acknowledgements

Thank you for using RouteDumper! We hope it helps you in organizing and documenting your Express routes efficiently.