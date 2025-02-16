
# Simple Deploy

IIS webhook endpoint for GitHub / GitLab / BitBucket* for easy web-site publishing

### How it works

- You commit web-site updates to your local Git repository, and push to GitHub / GitLab / BitBucket*
- This triggers GitHub / GitLab / BitBucket* to send a webhook request to Simple Deploy running on your IIS web-server.
- Simple Deploy fetches the updates from GitHub / GitLab / BitBucket* and checks them out to the web-site's folder.
- Your web-site is updated, and so is your off-site GitHub / GitLab / BitBucket* repository.

### Features

- Publish any number of web-sites, each with its own automatically generated unique webhook url and output directory.
- Manage it in a nice user friendly UI, without worrying about correct Git command line options, etc.
- Runs as a web-site under IIS on Windows.
- Easy installation - unzip and create an IIS web-site.

### Open Source and free

Simple Deploy is an open-source project licensed with a MIT License.


See <https://simpledeploy.jesperhoy.dev>
