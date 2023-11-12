# Boiler

This is an opinionated boilerplate for creative web development. Use it at your own risk. I have the project open sourced so that others can learn or make improvements, plus to share what i am working on.

## Main Features

- SPA model
- Vite
- Bun
- Three
- Custom Virtual DOM
- JSX
- Virtual Scrolling
- Custom Animation library (Piezo)
- SASS
- Sanity CMS connectivity

The idea is simple. I want to template with JSX, which allows me to pump it right into Javascript classes. Vite allows me to use esbuild and use my own JSX Factory, creating a custom Virtual DOM that handles routing and such. I want to use little-to-no third-party packages. This is a design choice, but also a choice that allows me to work through building it all from scratch. Having little dependencies also allows me to build the whole boilerplate in a cohesive manner, removing fluff and redundancy.

This boilerplate is meant to be picked apart. This is by no means a complete, done-for-you boilerplate. It is simply a start and I encourage developers to add or remove components/classes to make a tailored code-base for each project.

If you don't like it thats fine.

Enjoy.

## Getting Started

Install Bun

```bash
brew tap oven-sh/bun # use whichever way you like (npm, homebrew, curl ) https://bun.sh/docs/installation
```

Install Packages

```bash
bun install
```

Start Development

```bash
bun run dev
```

Build

```bash
bun run build
```

## Admin

Create your own project on Sanity and add project ID to ```./Core/Admin/index.js```

