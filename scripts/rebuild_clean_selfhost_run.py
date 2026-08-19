from urllib.error import HTTPError

import rebuild_clean_selfhost as build

_original_download = build.download


def download_with_dead_css_fallback(url: str):
    try:
        return _original_download(url)
    except HTTPError as exc:
        # These style references return 404 on Framer itself. Preserve the
        # original runtime behavior without keeping an external dependency by
        # materializing an empty local stylesheet. Never ignore missing JS,
        # modules, fonts, images, or any non-404 failure.
        if exc.code == 404 and urlsplit_path(url).endswith("/styles.css"):
            return b"/* upstream Framer stylesheet is 404; local no-op fallback */\n", "text/css"
        raise


def urlsplit_path(url: str) -> str:
    from urllib.parse import urlsplit

    return urlsplit(url).path


build.download = download_with_dead_css_fallback
build.main()
