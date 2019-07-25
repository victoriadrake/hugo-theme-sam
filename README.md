<h1><a href="https://hugo-sam.netlify.com/" target="_blank" rel="noopener">Call me Sam: a theme for Hugo</a></h1>

[![Netlify Status](https://api.netlify.com/api/v1/badges/b069f23f-06c5-4af6-b1aa-6304d986f9b0/deploy-status)](https://app.netlify.com/sites/hugo-sam/deploys)
[![Build Status](https://travis-ci.com/victoriadrake/hugo-theme-sam.svg?branch=master)](https://travis-ci.com/victoriadrake/hugo-theme-sam)
![Latest Release](https://img.shields.io/github/tag/victoriadrake/hugo-theme-sam.svg)

![Main page screenshot](https://github.com/victoriadrake/hugo-theme-sam/blob/master/images/screenshot.png)

Sam is a Simple and Minimalist theme for Hugo. It lets you categorize and showcase your content the way you want to.

Focused on content and typography, the stylized index page is really just a list of navigation links that you can set in your `config.toml`. This versatile design is limited only by your imagination, as you can make it say anything you like. Here are some ideas.

![Index page iterations.](https://github.com/victoriadrake/hugo-theme-sam/blob/master/images/ideas.png)

# Features:

- Showcase content
    - Content-focused page templates for list pages, single pages, and posts
    - A responsive CSS grid gallery page that renders from images in your [Page Bundle](https://gohugo.io/content-management/organization/#page-bundles)
- Customize
    - Custom navigation menu set via `config.toml`
    - Custom footer text
- Developer-approved
    - Syntax highlighting
    - Share-ready pages with [Open Graph](https://gohugo.io/templates/internal/#open-graph) and [Twitter](https://gohugo.io/templates/internal/#twitter-cards) metadata you can customize in `config.toml` and page front-matter
    - Effortless use of Hugo Pipes to generate CSS from Sass files


# Quick start

## 1. Get the theme

Run from the root of your Hugo site:
```sh
$ git clone https://github.com/victoriadrake/hugo-theme-sam.git themes/sam
```

Alternatively you can include this repository as a [git submodule](https://git-scm.com/book/de/v1/Git-Tools-Submodule). This makes it easier to update this theme if you have your Hugo site in git as well. For this you need to run:

```sh
$ git submodule add https://github.com/victoriadrake/hugo-theme-sam.git themes/sam
```

## 2. Configure your site

From the exampleSite, copy `config.toml` to the root folder of your Hugo site and change the fields as you like. There are helpful hints in the file.

## 3. Create pages

Run:
```sh
$ hugo new page.md
```
Where `page` can be anything you like. A contact page, a bio, dates for your upcoming world tour... Anything!

## 4. Design your main menu and index page

In `config.toml`, customize the entries for `[[params.mainMenu]]` however you like. You can have as many or as few entries as you like. You can even include external links.

This list comprises the index page and part of the navigation menu at the bottom of single content pages. Here's an example:

```
[[params.mainMenu]]
    link = "/photography"
    text = "photography"

[[params.mainMenu]]
    link = "/posts"
    text = "writing"

[[params.mainMenu]]
    link = "/about"
    text = "who dis?"
```

## Preview your site locally

Use Hugo's built-in server to see your site in action as you make changes.

```sh
$ hugo serve -t sam
```

Visit `localhost:1313` in your browser to see a live preview of your site.

## Posts

To create a new post, run:
```sh
$ hugo new posts/your-post-title.md
```

## Image gallery

To create an image gallery, place all the files you want included in your [Page Bundle](https://gohugo.io/content-management/organization/#page-bundles). The directory structure might then look like this:

```
content/
 └── gallery/
     └── _index.md
     └── images/
         ├── file_1.jpg
         ├── file_2.jpg
         └── file_3.jpg
```

To automagically generate a gallery from the images, set `type: "gallery"` in the front-matter of `_index.md`. You can also set other options for the gallery:

* The gallery `title`
* The page link with `url`
* The `maxWidth` of the resized images
* Whether you want the images to link to the full size files, with `clickablePhotos`

Here is an example of a gallery's `_index.md`:

```yaml
---
title: "Portraits"
type: "gallery"
url: "/portrait-gallery"
maxWidth: "800x"
clickablePhotos: true
---
```

In order to create more than one gallery, create multiple Page Bundles with images and `type: "gallery"` defined in the `_index.md` front matter. For example:

```
content/
 | └── gallery/
 |     └── _index.md
 |     └── images/
 |         ├── file_1.jpg
 |         ├── file_2.jpg
 |         └── file_3.jpg
 |
 └── portfolio/
     └── _index.md
     └── images/
         ├── file_1.jpg
         ├── file_2.jpg
         └── file_3.jpg
```

That's it! Sam's gallery layout template will automagically build the page from your images.


# Editing the theme

This theme uses [Hugo Pipes](https://gohugo.io/hugo-pipes/introduction/) to compile, autoprefix, and minify its CSS styles from the included Sass files. You can run the built-in server to preview the site as you make changes to the Sass files!

# Contributing

Pull requests for bug fixes and enhancements are welcome.

Open source themes like this one would not be possible without some amazing __[contributors](https://github.com/victoriadrake/hugo-theme-sam/graphs/contributors)__. Thank you!

# License
Copyright (C) 2018-2019 Victoria Drake

Licensed under [AGPL-3.0](https://github.com/victoriadrake/hugo-theme-sam/blob/master/LICENSE)
