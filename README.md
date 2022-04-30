# [Call me Sam: a theme for Hugo](https://victoria.dev/hugo-theme-sam/)

![Test Hugo versions](https://github.com/victoriadrake/hugo-theme-sam/workflows/test-versions/badge.svg)
![Latest Release](https://img.shields.io/github/tag/victoriadrake/hugo-theme-sam.svg)

![Main page screenshot](https://github.com/victoriadrake/hugo-theme-sam/blob/master/images/screenshot.png)

Sam is a Simple and Minimalist theme for Hugo. It lets you categorize and showcase your content the way you want to.

Focused on content and typography, the stylized index page is really just a list of navigation links that you can set in your `config.toml`. This versatile design is limited only by your imagination, as you can make it say anything you like. Here are some ideas.

![Index page iterations.](https://github.com/victoriadrake/hugo-theme-sam/blob/master/images/ideas.png)

## Features

- Showcase content
  - Content-focused page templates for list pages, single pages, and posts
  - A responsive CSS grid gallery page that renders from images in your [Page Bundle](https://gohugo.io/content-management/organization/#page-bundles)
- Customize
  - Custom navigation menu set via `config.toml`
  - Custom footer text
  - Custom background video via `config.toml`
- Developer-approved
  - Syntax highlighting
  - Share-ready pages with [Open Graph](https://gohugo.io/templates/internal/#open-graph) and [Twitter](https://gohugo.io/templates/internal/#twitter-cards) metadata you can customize in `config.toml` and page front-matter
  - Effortless use of Hugo Pipes to generate CSS from Sass files
  - Tested for compatibility with Hugo versions as far back as `0.49.2`

## Quick start

## Requirements

Requires the **extended** version of Hugo. You can find [installation instructions here](https://gohugo.io/getting-started/installing/) (latest version recommended). Here's a handy [Bash function for downloading a specific Hugo version](https://victoria.dev/blog/how-to-do-twice-as-much-with-half-the-keystrokes-using-.bashrc/#bash-function-for-downloading-extended-hugo).

Extended Hugo's [PostCSS](https://gohugo.io/hugo-pipes/postcss/) requires JavaScript packages to compile the styles for this theme. If you're seeing an error like this:

```text
Error: Error building site: POSTCSS failed to transform "css/main.css"
```

Install the required packages globally using `npm`. You'll need `postcss`, `postcss-cli`, and `autoprefixer`.

```sh
npm i -g postcss postcss-cli autoprefixer
```

If you're new to Node.js and npm, [learn how to install and use npm here](https://www.npmjs.com/get-npm). It is recommended that you use a version manager for your Node.js installation, such as [`nvm`](https://github.com/nvm-sh/nvm).

Note: If you are using [Hugo as a snap app](https://snapcraft.io/hugo), the above two Node.js packages have to be [installed locally inside `exampleSite`](https://gohugo.io/hugo-pipes/postcss/).

```sh
cd exampleSite/
npm i postcss postcss-cli autoprefixer
```

## 1. Get the theme

### Use the theme as hugo module

1. Ensure that Go is installed (version >= 1.12). Download the Go installer [here](https://go.dev/dl/).

2. Turn your new or existing site into a hugo module by issuing this command from site root:

    ```sh
    hugo mod init github.com/me/my-sam-based-site
    ```

3. Declare the `sam` theme module as a dependency of your site:

    ```sh
    hugo mod get github.com/victoriadrake/hugo-theme-sam
    ```

### Use the theme locally with git clone or as a submodule

Run from the root of your Hugo site:

```sh
git clone https://github.com/victoriadrake/hugo-theme-sam.git themes/sam
```

Alternatively you can include this repository as a [git submodule](https://git-scm.com/book/de/v1/Git-Tools-Submodule). This makes it easier to update this theme if you have your Hugo site in git as well. For this you need to run:

```sh
git submodule add https://github.com/victoriadrake/hugo-theme-sam.git themes/sam
```

### 2. Configure your site

From the exampleSite, copy `config.toml` to the root folder of your Hugo site. Inside this file, identify the `theme = ...` line.

#### To configure as a Hugo module

Make sure the following line is uncommented in order to activate your theme as hugo module:

```toml
theme = "github.com/victoriadrake/hugo-theme-sam"
```

#### To configure a local theme

Make sure the following line is uncommented:

```toml
theme = "sam"
```

Afterwards, adapt the configuration parameters inside `config.toml` as you like. There are helpful hints in the file.

### 3. Create pages

Run:

```sh
hugo new page.md
```

Where `page` can be anything you like. A contact page, a bio, dates for your upcoming world tour... Anything!

### 4. Design your main menu and index page

In `config.toml`, customize the entries for `[[params.mainMenu]]` however you like. You can have as many or as few entries as you like. You can even include external links.

This list comprises the index page and part of the navigation menu at the bottom of single content pages. Here's an example:

```toml
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
hugo serve -t sam
```

Visit `localhost:1313` in your browser to see a live preview of your site.

## Posts

To create a new post, run:

```sh
hugo new posts/your-post-title.md
```

## Image gallery

To create an image gallery, place all the files you want included in your [Page Bundle](https://gohugo.io/content-management/organization/#page-bundles). The directory structure might then look like this:

```sh
content/
 └── gallery/
      ├── _index.md
      ├── file_1.jpg
      ├── file_2.jpg
      └── file_3.jpg
```

To automagically generate a gallery from the images, set `type: "gallery"` in the front-matter of `_index.md`. You can also set other options for the gallery:

- The gallery `title`
- The page link with `url`
- The `maxWidth` of the resized images
- Whether you want the images to link to the full size files, with `clickablePhotos`
- You can keep the orignal aspect ratio of the images in the grid with `keepAspectRatio`

Here is an example of a gallery's `_index.md`:

```yaml
---
title: "Portraits"
type: "gallery"
url: "/portrait-gallery"
maxWidth: "800x"
clickablePhotos: true
keepAspectRatio: false
---
```

In order to create more than one gallery, create multiple Page Bundles with images and `type: "gallery"` defined in the `_index.md` front matter. For example:

```text
content/
 ├── gallery/
 |   ├── _index.md
 |   ├── file_1.jpg
 |   ├── file_2.jpg
 |   └── file_3.jpg
 |
 └── portfolio/
     ├── _index.md
     ├── file_1.jpg
     ├── file_2.jpg
     └── file_3.jpg
```

That's it! Sam's gallery layout template will automagically build the page from your images.

## Custom video background

To change the default home page background to a looping video, you need to set a list of video sources and optionally an overlay color (default: `rgba(0, 0, 0, 0.4)`).

Here is an example configuration of `config.toml`:

```toml
[[params.videoBackground.sources]]
    source  = "/background.mp4" # Your video file
    type    = "video/mp4"
    poster  = "/background.jpg" # The image to show when the video isn't playing

[params.videoBackground]
    overlay = "rgba(0, 0, 0, 0.4)" # optional

```

And here is a screenshot of what that might look like:

![Video background main page screenshot](https://github.com/victoriadrake/hugo-theme-sam/blob/master/images/video_screenshot.png)

## Editing the theme

This theme uses [Hugo Pipes](https://gohugo.io/hugo-pipes/introduction/) to compile, autoprefix, and minify its CSS styles from the included Sass files.

To make changes to the CSS, edit the Sass files located in `assets/sass/`, then build your site using extended Hugo, which you can obtain from [Hugo Releases](https://github.com/gohugoio/hugo/releases).

If when building you do not see the changes you have done, make sure to build your website with the `--ignoreCache` flag, otherwise Hugo will
attempt to use its own cached Sass files.

You can run the built-in server to preview the site as you make changes to the Sass files!

## Issues

If you have a question or get stuck, please [open an issue](https://github.com/victoriadrake/hugo-theme-sam/issues) for help and to help those who come after you. The more information you can provide, the better!

## Contributing

Pull requests for bug fixes and enhancements are welcome! Please ensure you first read about [contributing](CONTRIBUTING.md) to this project.

Open source themes like this one would not be possible without some amazing **[contributors](https://github.com/victoriadrake/hugo-theme-sam/graphs/contributors).** Thank you!

## License

Copyright (C) 2018-2022 [Victoria Drake](https://victoria.dev/)

Licensed under the [Apache License, Version 2.0](https://github.com/victoriadrake/hugo-theme-sam/blob/master/LICENSE) (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
