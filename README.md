# viniciusjardim.com

<img src="public/favicon-2.svg" alt="viniciusjardim.com logo" width="72" height="72">

I'm developing [viniciusjardim.com](https://www.viniciusjardim.com/) as an excuse to write some code outside of work! I will share my thoughts about programming and other topics there.

See you later! 🚀

### Tasks

- [x] Create and display posts
  - [x] Add title, slug, Tiptap editor
  - [x] Add code syntax highlight with Prism
  - [x] Post create, edit form, and remove functionality
  - [x] Display posts in the home page
  - [x] Display post in `/posts/:slug`
  - [x] Display image on the post
  - [x] Display videos on the post
- [x] Blog text editor
  - [x] Create post JSON parser as a recursive component
  - [x] Add buttons to control Tiptap editor functions (eg. bold, italic, H1, code, etc.)
  - [x] Use a modal to pass additional properties to the post element (eg. image `alt`)
  - [x] Add image support
    - [x] Pass props to the image to control size, `alt`, and alignment
  - [x] Add video support
    - [ ] Pass props to the video to control size, video controls, and alignment
  - [ ] Allow editing codeblocks language, image props and video props
  - [ ] Replace editor buttons text with their icons
  - [x] Refactor code to only have one editor component
  - [ ] Add upload files button on the editor
- [ ] Manage files from UploadThing in the admin upload page
  - [x] Upload new file
  - [ ] List files
  - [ ] Delete files
- [ ] Post card and post metadata
  - [ ] Add post main image
  - [x] Add metadata on the post page
  - [x] Create post card component with image, title and description
  - [x] Replace post in the homepage with the post card
- [ ] Log create, update, and delete operations on log tables
  - [x] Create PostLog
  - [ ] Create CategoryLog

### Database

To backup the database use:

```
pg_dump -v -d <non pooling db url> -f bak-YYYY-MM-DD.sql
```
