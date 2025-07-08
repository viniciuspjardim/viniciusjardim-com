# viniciusjardim.com

<img src="public/favicon-2.svg" alt="viniciusjardim.com logo" width="72" height="72">

I'm developing [viniciusjardim.com](https://www.viniciusjardim.com/) as an excuse to write some code outside of work! I'm sharing my thoughts about programming and other topics there. Check it out!

### Debugging

There are four debugging configurations:

- `server debug`
- `client debug` - run `bun run dev` before debugging
- `full stack debug`
- `unit test debug` - open the test file before debugging

### Database

To backup the database use:

```
pg_dump -v -d <non pooling db url> -f bak-YYYY-MM-DD.sql
```

### Tasks

- [x] Display posts
  - [x] Display title, slug, Tiptap editor
  - [x] Display code syntax highlight with Prism
  - [x] Display code block file name and copy button
  - [x] Post create, edit form, and remove functionality
  - [x] Display posts in the home page
  - [x] Display post in `/posts/:slug`
  - [x] Display image on the post
  - [x] Display videos on the post
  - [x] Display post side nav with headings and scroll to the top link
  - [ ] Fix code font size inside headings
  - [x] Make a better player for the audio with fixed position and slider
  - [ ] Add share button with social media options and copy button
  - [ ] Add a summary generated with AI
- [x] Blog text editor
  - [x] Create post JSON parser as a recursive component
  - [x] Add buttons to control Tiptap editor functions (eg. bold, italic, H3, code, etc.)
  - [x] Add image support
    - [x] Pass props to the image to control size, `alt`, etc.
  - [x] Add video support
    - [ ] Pass props to the video to control size, video controls
  - [x] Allow editing codeblocks language and file name
  - [x] Replace editor buttons text with their icons
  - [x] Refactor code to only have one editor component
  - [x] Refactor code to pass full post object to post component
  - [x] Refactor layout to make editor full height and make toolbar always visible on mobile
    - [x] Move the scroll area to the tab content section
    - [x] Move editor toolbar to the header with the tabs
    - [x] Detect virtual keyboard and reserve space to it
    - [x] Reserve space to virtual keyboard on editor modals
- [x] Text to speech (TTS)
  - [x] Integrate with OpenAI TTS model
  - [x] Generate post audio and store the MP3 file on UploadThing
  - [x] Create audio player and show it on the post
  - [x] Workaround TTS only supporting 4096 characters in length
    - [x] Generate two or more files per post when necessary - append the files in one mp3 file
- [x] Manage files from UploadThing in the admin upload page
  - [x] Upload new file
  - [ ] List files
  - [ ] Delete files
- [x] Post card and post metadata
  - [x] Add post main image
  - [x] Add metadata on the post page
  - [x] Create post card component with image, title and description
  - [x] Replace post in the homepage with the post card
- [ ] Refactor post API and database layer
  - [x] Use Postgres JSONB to store the post content
  - [ ] Add another JSONB column to store post metadata like image, audio, links, etc.
  - [ ] Rework homepage and category endpoints to only fetch necessary data (not all the post content)
- [x] Upgrade to Tailwind v4 and shadcn/ui components
  - [x] Run Tailwind code mod
  - [x] Fix UploadThing styles
  - [x] Fix image dialog labels, spacing, input background color, and text area border radius
  - [x] Replace `tailwindcss-animate` in favor of `tw-animate-css`
  - [x] Update shadcn/ui dependencies
  - [x] Fix modal animations
  - [x] Fix audio player animation
  - [x] Remove `React.forwardRef`
  - [x] Upgrade shadcn/ui components
  - [x] Move shadcn/ui to use CSS variables
- [ ] Other refactors and Improvements
  - [x] Move from PlanetScale to Vercel Postgres
  - [x] Move from Prisma to Drizzle
  - [x] Move from Vercel Postgres to Neon Postgres
  - [x] Upgrade to Next.js 15, tRPC 11 and Clerk 6
  - [ ] Cache pages and requests when possible using Next.js cache
- [ ] Log create, update, and delete operations on log tables
  - [x] Create PostLog
  - [ ] Create CategoryLog
- [ ] Cache
  - [x] Cache database query results
  - [ ] Replace the above cache by full page caches
