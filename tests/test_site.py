import importlib.util
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("checker", ROOT / "scripts/check_html.py")
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


class SiteTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="sam-site-")
        self.addCleanup(self.temp.cleanup)
        self.theme = Path(self.temp.name) / "sam"
        shutil.copytree(ROOT, self.theme, ignore=shutil.ignore_patterns(
            ".git", "node_modules", "resources", ".hugo-resources", "public", "docs", "__pycache__"))
        (self.theme / "node_modules").symlink_to(ROOT / "node_modules", target_is_directory=True)
        self.output = self.theme / "public"

    def build(self, base="https://victoria.dev/hugo-theme-sam/"):
        return subprocess.run(["sh", str(self.theme / "scripts/build_docs.sh")],
            cwd=self.temp.name, env=dict(os.environ, HUGO_BASEURL=base), capture_output=True, text=True)

    def test_production_assets_and_metadata_under_subpath(self):
        page = self.theme / "exampleSite/content/posts/image-post.md"
        page.write_text(page.read_text().replace("showDate: true", "showDate: true\ndescription: A page-specific description."))
        result = self.build()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn("deprecated", result.stderr)
        count, errors = checker.check_site(self.output, "https://victoria.dev/hugo-theme-sam/", ["example.com"], ["https://victoria.dev"])
        self.assertGreater(count, 10)
        self.assertEqual(errors, [])
        html = (self.output / "posts/image-post/index.html").read_text()
        self.assertIn('content="A page-specific description."', html)
        self.assertIn("https://victoria.dev/hugo-theme-sam/posts/ideas.png", html)
        self.assertIn('src=/hugo-theme-sam/posts/ideas.png', html)
        home = (self.output / "index.html").read_text()
        self.assertIn('poster=/hugo-theme-sam/background.png', home)
        self.assertIn('src=/hugo-theme-sam/sample_video.mp4', home)
        self.assertNotIn(' autoplay', home)

    def test_root_hosting_and_menu_links(self):
        config = self.theme / "exampleSite/config.toml"
        config.write_text(config.read_text().replace('link = "posts"', 'link = "/posts"').replace('link = "about"', 'link = "https://example.org/profile"'))
        result = self.build("https://example.org/")
        self.assertEqual(result.returncode, 0, result.stderr)
        html = (self.output / "index.html").read_text()
        self.assertIn('href=/posts', html)
        self.assertIn('href=https://example.org/profile', html)
        self.assertIn('poster=/background.png', html)

    def test_gallery_default_width_and_plain_gallery(self):
        page = self.theme / "exampleSite/content/gallery/_index.md"
        page.write_text(page.read_text().replace('maxWidth: "800x"\n', '').replace('clickablePhotos: true', 'clickablePhotos: false'))
        result = self.build()
        self.assertEqual(result.returncode, 0, result.stderr)
        html = (self.output / "gallery/index.html").read_text()
        self.assertIn('<img', html)
        self.assertNotIn('data-gallery=', html)
        self.assertNotIn('photoswipe', html)

    def test_gallery_invalid_width_has_actionable_error(self):
        page = self.theme / "exampleSite/content/gallery/_index.md"
        page.write_text(page.read_text().replace('maxWidth: "800x"', 'maxWidth: "wrong"'))
        result = self.build()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('maxWidth must be a width such as 800x', result.stderr)

    def test_legacy_video_poster_is_supported(self):
        config = self.theme / "exampleSite/config.toml"
        config.write_text(config.read_text().replace('    type    = "video/mp4"', '    type    = "video/mp4"\n    poster = "/background.png"').replace('[params.videoBackground]\n    poster = "/background.png"', '[params.videoBackground]'))
        result = self.build()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('poster=/hugo-theme-sam/background.png', (self.output / "index.html").read_text())


class CheckerTests(unittest.TestCase):
    def test_empty_output_fails(self):
        with tempfile.TemporaryDirectory(prefix="sam-check-") as d:
            self.assertEqual(checker.check_site(d, "https://example.org/")[0], 0)
            self.assertTrue(checker.check_site(d, "https://example.org/")[1])

    def test_missing_assets_and_wrong_base_paths_fail(self):
        with tempfile.TemporaryDirectory(prefix="sam-check-") as d:
            Path(d, "index.html").write_text('<video poster="/poster.png"><source src="missing.mp4"></video><meta property="og:image" content="/preview.png"><img src="missing.jpg">')
            count, errors = checker.check_site(d, "https://example.org/sam/")
            self.assertEqual(count, 1)
            self.assertEqual(len(errors), 4)


if __name__ == "__main__":
    unittest.main()
