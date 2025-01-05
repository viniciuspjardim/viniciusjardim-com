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
  - [ ] Use a modal to pass additional properties to the post element (eg. image `alt`)
  - [x] Add image support
    - [ ] Pass props to the image to control size, `alt`, and alignment
  - [x] Add video support
    - [ ] Pass props to the video to control size, video controls, and alignment
  - [ ] Allow editing codeblocks language, image props and video props
  - [ ] Replace editor buttons text with their icons
  - [ ] Refactor code to only have one editor component
  - [ ] Add upload files button on the editor
- [ ] Manage files from UploadThing in the admin upload page
  - [x] Upload new file
  - [ ] List files
  - [ ] Delete files
- [ ] Post card and post metadata
  - [ ] Add post main image
  - [ ] Add metadata on the post page
  - [ ] Create post card component with image, title and description
  - [ ] Replace post in the homepage with the post card
