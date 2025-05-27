## Project

## Installing Project Dependencies

### Storefront
# Install dependencies in the storefront project folder
cd apps/storefront
bun install

### Admin
# Install dependencies in the admin project folder
cd apps/admin
bun install

### Installing Supabase for Prisma
# Install Supabase in the root folder
bunx supabase init

### Running Supabase Locally
bunx supabase start

### Getting DB_URL
After starting Supabase locally, you will see the DB URL in the terminal. Copy it into your `.env` file:
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres

### Getting JWT Secret
After starting Supabase locally, you will see the JWT secret. Copy it into your `.env` file:
JWT Secret: super-secret-jwt-token-with-at-least-32-characters-long

### Seeding the Database
#### Step 1 - Setting Up `package.json`
Ensure your `package.json` has the following script for both the storefront and admin projects:
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}

#### Step 2 - Installing Dependencies
Install the dependencies needed to seed your database.

# Install dependencies in the storefront project folder
cd apps/storefront
bun add typescript ts-node @types/node --dev

# Install dependencies in the admin project folder
cd apps/admin
bun add typescript ts-node @types/node --dev

### Step 3 - Seeding
Run the command below in the admin project folder:
bun run db:push
bun run db:seed

## Running the Project
After installing and configuring all dependencies, run the `dev` command in each project's specific folder:
bun run dev

Also, make sure your Supabase is running locally with:
bunx supabase start
You can view Supabase Studio locally at http://localhost:54323/project/default.

## Technical Decisions

### Incorrect Usage of Environment Variable Keys
In the file `user-auth-form.tsx` in the storefront project, there is a validation requiring the `JWT_SECRET_KEY` for login attempts. This is incorrect because the file is a client component. Environment variables can only be accessed in client components if they have the prefix `NEXT_PUBLIC`; otherwise, Next.js prevents verification due to potential security risks. To enable login, I had to remove this snippet.

Verify Next.js documentation on environment variables here: https://nextjs.org/docs/pages/guides/environment-variables.

I noticed that the PR introducing this issue was merged on 01/01/2025, so I believe no one has caught this issue yet. PR link: github.com/sesto-dev/next-prisma-tailwind-ecommerce/commit/3f21c757be67f1e4512bf17d013db3f9007068b5.

### Part 1: Rebuilding the Product Page Filter
- The state is controlled using query parameters in the URL, allowing users to share URLs and persist searches.
- Filtering is done server-side using Prisma to handle large datasets efficiently, avoiding expensive client-side computations.
- A debounce is added to the price slider to prevent unnecessary requests.
- A modal was created for searching products directly on the homepage.
- When mutating URL query parameters, the function `startTransition` from React is used to mark updates as non-urgent, ensuring a smooth and responsive UI.
- The function `formatSearchParams` translates URL parameters into a format the application can process safely. Utility functions such as `parseQueryParamToString`, `parseQueryParamToArray`, and `parseQueryParamToDate` ensure that the Prisma query does not receive unknown parameters that could break the application.

### Part 2: Admin Reporting Page
- A new `/reports` route was created.
- Only owners with valid tokens can access this route due to middleware configuration.
- Searching on this page is server-side to handle large datasets more efficiently.
- Product names and counts are retrieved and sorted using Prisma functions like `distinct` queries and `groupBy` with count summation, avoiding inefficient client-side JavaScript operations.

### Part 3: Extending the Prisma DB Model & Enhancing Cross-Sell Functionality
- Cross-sell functionality is managed using a many-to-many relationship.
- A new section was added to the Product Form in the Admin project for configuring cross-sell options.
- The `CartContext` was refactored to allow reuse in both the product screen and the cart page for adding/removing items.
- The original toast notifications from `react-hot-toast` were replaced with ShadCN’s toast version for improved functionality.

### Preview

#### Search Page
![https://ibb.co/W4jL0TKM](https://ibb.co/W4jL0TKM)

#### Admin Reports Page
![https://ibb.co/mC9fKMBs](https://ibb.co/mC9fKMBs)

#### Admin Cross-Sell New Form
![https://ibb.co/YFrWj2w8](https://ibb.co/YFrWj2w8)

#### Cross-Sell in Product Page
![https://ibb.co/RGyPYc8S](https://ibb.co/RGyPYc8S)

#### Cross-Sell in Cart Page
![https://ibb.co/qLrRfp0v](https://ibb.co/qLrRfp0v)
