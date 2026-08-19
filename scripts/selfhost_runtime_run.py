import selfhost_runtime as build

# Only infrastructure that is required to render/hydrate the page is mirrored.
# Ordinary outbound links in footer/content are not runtime dependencies.
build.MIRROR_HOSTS = {
    "framerusercontent.com",
    "fonts.gstatic.com",
    "fonts.googleapis.com",
}

build.main()
