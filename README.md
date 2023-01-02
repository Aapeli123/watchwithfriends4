# watchwithfriends4

Watchwithfriends is a website that allows people to watch videos together.

This is version 4 of the code and is basically completely rewritten from scratch, because the last codebase was not readable and included some unnecessary features. Also bad UI.

## Status:

[![Build and deploy client](https://github.com/Aapeli123/watchwithfriends4/actions/workflows/client.yml/badge.svg?branch=main)](https://github.com/Aapeli123/watchwithfriends4/actions/workflows/client.yml)
[![Build and deploy server](https://github.com/Aapeli123/watchwithfriends4/actions/workflows/server.yml/badge.svg?branch=main)](https://github.com/Aapeli123/watchwithfriends4/actions/workflows/server.yml)

## What video services does this support?

For now, the server does not check the video link, only shares it to clients. For frontend support see [ReactPlayer video supported media](https://github.com/cookpete/react-player/tree/v2.11.0#supported-media).

## How to deploy?

### Building the client:

See [client docs](client/README.md)

### Building the server:

See [server docs](server/README.md)

### Entire build process on linux:

I have tested this on ubuntu but I think that it should work on other distros as well.

This assumes that Node.js, cargo and make are already installed on the machine:

```bash
git clone git@github.com:Aapeli123/watchwithfriends4.git
cd watchwithfriends4
# Build client:
cd client
npm i -g yarn # Install yarn
yarn # Installs dependencies
yarn build # Builds web app to ./dist folder, copy it to the directory that your server serves from.
# Build the server
cd ../server
cargo build --release # Builds the server executable
sudo make install # installs the server as a systemd daemon
```

### Deployment:

I deploy this to a Ubuntu 22.04 LTS DigitalOcean droplet with NGINX as the webserver.
The NGINX Configuration file can be found as a gist [here](https://gist.github.com/Aapeli123/2c14d47088b791c071c086880d428f17).

## Contributing

Pull requests are welcome, first create a fork and implement the feature or fix. Then create the pull request. For large new features please create an issue first for discussion.

## Licence

[MIT](LICENCE)
