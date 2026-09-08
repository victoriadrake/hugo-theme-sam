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
  - Tested with Hugo Extended `0.163.0` and the latest release

## Quick start

Preview the example site with Hugo Extended **0.163.0 or newer** and Node.js **22.12 or newer** (Node 24 recommended):

```sh
git clone https://github.com/victoriadrake/hugo-theme-sam.git
cd hugo-theme-sam
npm ci --ignore-scripts
npm run dev
```

Open the localhost address printed by Hugo. `npm run build` creates the production demo in `public/`; `npm run check:html` checks the generated pages and their local assets.

## Requirements

Use the **extended** edition of [Hugo](https://gohugo.io/installation/). The supported minimum is **0.163.0**. The demo deployment pins **0.165.0**, while CI tests the minimum and latest releases.

Production CSS uses PostCSS and Autoprefixer. This repository pins its build and test dependencies in `package-lock.json`; use `npm ci --ignore-scripts` for repeatable installs. No global packages are required. The gallery's PhotoSwipe 5.4.4 files are vendored, so theme users do not need to install PhotoSwipe.

For your own Hugo site, install these build dependencies **in your site root** and commit the resulting package manifest and lockfile:

```sh
npm install --save-dev --save-exact --ignore-scripts postcss@8.5.28 postcss-cli@12.0.0 autoprefixer@10.5.5
```

On subsequent builds, use `npm ci --ignore-scripts`. Ensure the local tools are available when invoking Hugo:

```sh
PATH="$PWD/node_modules/.bin:$PATH" hugo --minify
```

Hugo's development server skips PostCSS, but production builds require these dependencies.

## 1. Get the theme

### Use the theme as hugo module

1. Ensure that Go is installed. Download the Go installer [here](https://go.dev/dl/).

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
- The `maxWidth` of the resized images (defaults to `"800x"`; use a positive width followed by `x`)
- Whether you want the images to link to the full size files, with `clickablePhotos`
- You can keep the original aspect ratio of the images in the grid with `keepAspectRatio`

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

Clickable galleries support keyboard activation, arrow navigation, Escape to close, and focus return. Without JavaScript, links open the full image. Reduced-motion preferences disable lightbox animations.

Photo links use the image filename, so they remain valid when the gallery is reshuffled between builds. Legacy `gid=1&pid=1` links still use one-based positions in the current build. PhotoSwipe 5 replaces the old v4 lightbox; the old social-sharing and fullscreen buttons are no longer included. Copy the address while an image is open to share that image.

You can provide meaningful image alt text through page resource metadata:

```yaml
resources:
  - src: "tokyo.jpg"
    params:
      alt: "A lantern-lit street in Tokyo at night"
```

SVG images are displayed without raster resizing or a lightbox.


## Custom video background

To change the default home page background to a looping video, you need to set a list of video sources and optionally an overlay color (default: `rgba(0, 0, 0, 0.4)`).

Here is an example configuration of `config.toml`:

```toml
[[params.videoBackground.sources]]
    source  = "/background.mp4" # Your video file
    type    = "video/mp4"

[params.videoBackground]
    poster = "/background.jpg" # The image to show when the video is not playing
    overlay = "rgba(0, 0, 0, 0.4)" # optional

```

The poster belongs to the video configuration, rather than each source. The former per-source `poster` setting remains supported as a fallback. Site-relative media paths work under a project subdirectory such as `/hugo-theme-sam/`. A playback button lets visitors pause the video; reduced-motion preferences keep it paused initially.

And here is a screenshot of what that might look like:

![Video background main page screenshot](https://github.com/victoriadrake/hugo-theme-sam/blob/master/images/video_screenshot.png)

## Editing the theme

This theme uses [Hugo Pipes](https://gohugo.io/hugo-pipes/introduction/) to compile, autoprefix, and minify its CSS styles from the included Sass files.

To make changes to the CSS, edit the Sass files located in `assets/sass/`, then build your site using extended Hugo, which you can obtain from [Hugo Releases](https://github.com/gohugoio/hugo/releases).

If when building you do not see the changes you have done, make sure to build your website with the `--ignoreCache` flag, otherwise Hugo will
attempt to use its own cached Sass files.

You can run the built-in server to preview the site as you make changes to the Sass files!

## Validation and demo deployment

Run the build and browser regression checks before submitting changes. Tests use Python 3.9+ and an installed Google Chrome browser; both are available on the GitHub-hosted Ubuntu runner.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run check:html
```

The build helper can run from any working directory. `HUGO_BASEURL` overrides the demo URL; `HUGO_DESTINATION` overrides the output directory. Hugo cleans the selected output directory, so use a dedicated generated-output directory. Generated output, caches, and downloaded installers are excluded from source control.

The demo is published by the **Deploy demo to Pages** GitHub Actions workflow. It tests and builds the site, validates the generated HTML, and uploads a Pages artifact; it never commits or force-pushes generated files. Production deployment is serialized and uses a pinned Hugo release.

**Migration for this repository:** before publishing the new workflow, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**, replacing the old `master`/`docs` source. Keep the existing `victoria.dev/hugo-theme-sam/` project URL. This setting is on the Sam repository, not the main victoria.dev repository.

## Metadata

Each page's `description` overrides `params.description`. Social-preview images may be page resources, site-relative paths, or external URLs. Site-relative URLs retain the configured `baseURL` path. Set GA4 analytics with `[services.googleAnalytics]` and `ID = "G-XXXXXXXXXX"`; the old top-level `googleAnalytics` setting is no longer used.

## Issues

If you have a question or get stuck, please [open an issue](https://github.com/victoriadrake/hugo-theme-sam/issues) for help and to help those who come after you. The more information you can provide, the better!

## Contributing

Pull requests for bug fixes and enhancements are welcome! Please ensure you first read about [contributing](CONTRIBUTING.md) to this project.

Open source themes like this one would not be possible without some amazing **[contributors](https://github.com/victoriadrake/hugo-theme-sam/graphs/contributors).** Thank you!

## License

Copyright (C) 2017-2026 [Victoria Drake](https://victoria.dev/)

Licensed under the [Apache License, Version 2.0](https://github.com/victoriadrake/hugo-theme-sam/blob/master/LICENSE) (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
