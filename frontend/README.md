
# Loop frontend

Responsive Next.js App Router frontend based on the supplied Loop Figma overview.

## Run locally
1. `cd frontend`
2. `npm install`
3. Copy `.env.local.example` to `.env.local`
4. Set `NEXT_PUBLIC_API_URL=http://localhost:3001` (match your backend port)
5. `npm run dev`

## Included
- Login and signup connected to `POST /users/login` and `POST /users/create`
- JWT saved in localStorage and attached as `Authorization: Bearer <token>`
- Feed connected to `GET /posts/getall`
- Create post connected to `POST /posts/createpost` with multipart `images`
- Likes connected to `/like/likepost/:postId` and `/like/unlike/:postId`
- Comments connected to `/comment/getcomments/:postId` and `/comment/add/:postId`
- Profile edit and password change connected to existing user endpoints
- Responsive app shell, desktop sidebar, mobile drawer and bottom navigation

## Backend gaps to address
The supplied backend currently has no endpoints for:
- Search users/posts
- Messaging/conversations
- Notifications
- Fetching an arbitrary public user profile
- Following lists that include follow state/current user's suggestions

Those screens are currently UI scaffolds/sample content, not persisted features. The backend's `GET /posts/getall` currently does not populate author data, so post cards use a fallback author label until the controller populates `author`.

## Important
- Do not commit `.env.local`.
- localStorage token storage is a simple integration starting point, not the strongest production session design. For production, consider httpOnly secure cookies and CSRF protections.
- The provided backend has a `.env` file in its archive. Rotate any credentials that were real and remove `.env` from shared archives.
