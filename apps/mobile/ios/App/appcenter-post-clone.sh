#!/usr/bin/env bash

# Fail if any command fails.
set -e

NODE_VERSION=18.14.1

# Install Node.
. ~/.bashrc
nvm install "$NODE_VERSION"
nvm alias default "$NODE_VERSION"
nvm use default

# Go to the root of the repo.
cd ../../../..

# Install Turborepo CLI.
npm install -g --arch=x64 --platform=darwin turbo

# Install dependencies.
npm install

# Build the app.
turbo build

# Copy assets and install native dependencies.
cd apps/mobile
npx cap sync
