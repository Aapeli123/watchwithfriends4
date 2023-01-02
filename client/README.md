# Watchwithfriends client

This is the web app deployed to [watchwithfriends.ml](https://watchwithfriends.ml).

## Building

This app uses yarn for package management, so first you need to install it.

If you have node (if you don't, [install it now](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)):
`npm i -g yarn`

Then run `yarn install`, which installs the needed packages.

Run `yarn build` to build the distributable files, they will go to the `./dist` floder.

## Development

1. Clone the repo: `git clone git@github.com:Aapeli123/watchwithfriends4.git`

2. Go to the right directory: `cd ./watchwithfriends4/client`

3. Install packages `yarn install`

4. Start vite dev server: `yarn dev`

5. Before committing prettify code: `yarn prettify`

## File structure

### /public

Assets used in the web app.

### /src

The source code, split into multiple directories, more on them below:

### /src/lib

Code that communicates with the server and the non-react related code.

### /src/store

Redux store related code like reducers and store slices.

### /src/pages

The pages of the application, like the home screen or the room screen and their css.

### /src/ui

Reusable UI elements like modals and side/topbars
