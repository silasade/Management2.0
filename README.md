# About project
A fullstack application that extracts text from uploaded event invitation images using OCR.Space and Illama AI model to classify and generate a structured google calendar object and submits to a user google calendar. Authentication is only allowed using google oAuth.


## Tools and Technologies Used
API endpoints are defined by Next.js route handlers for server side fetching
- Frontend: Next.js, typescript, SCSS, Tailwind css and React query
- Backend: Next.js, Supabase, typescript
- Database PostGreSql
- CSS components libary: Ant design and Shadcn
- Testing: Vitest
  
## To run this project
  ```bash
  npm install
  npm run dev
```

## Key features
- Extract text from upload event IV images
- syncs to google calendar and database
- Edit, update and delete events from user calendar and database
- View events details
- Filter events based on completedness(completed, ongoing)
- Search for events by title

## Query functions

react-query from tanstack is used to handle API communications and they are found in the /src/lib/actions folder

- Each file in the folder represents a particular object for the backend e.g. the events file in the folder corresponds to the /api/event-related-tasks and the react query hooks are used for anything related to the name of the file.
- The naming convention of the react-query hooks depends on the action (get, create, delete, update) to perform e.g for a get action useGet...

## Folder structure

- Each page as a local components folder assigned to it
- the pages are found in the /src/app/(Routes)/page folder/
- components used in multiple pages are placed in the \_global_components

### Middleware

The role of the middleware found in the middleware.ts is to protect the routes that starts with /home making them protected routes and to refresh the provider token for google
