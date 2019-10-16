# Token scanner

```shell
npx @kth/lms-scan
```

Check that there is no Canvas API token in your codebase.

- Just one command.
- No installation needed.

# Options

## Default (no options)

Checks the whole directory and subdirectories.

```shell
npx @kth/lms-scan
```

Note: it will scan ALL the subdirectories (including git-ignored files and `node_modules`)

## `history` argument. Check the repository instead of just the directory

Check if there was some token in any file of any commit of the whole history of the current repo.

```shell
npx @kth/lms-scan history
```

You can limit the range of commits that are going to be scanned. This is particulary useful in CI environments where the CI knows about the "increment" of the build:

```shell
npx @kth/lms-scan history a4f2e5...b445e51
```

## `-r` (or `--remote`) flag: Check against KTH Canvas

If you pass the `-r` or `remote`, it will check against the [Canvas API](https://canvas.instructure.com/doc/api/) if the token is valid or not. It will try to reach the `/users/self` endpoint which is available for all users with a token and ONLY mark the token as "no longer valid" if Canvas response is a "401".

Examples:

```shell
# Search tokens in the current directory and check if they are valid:
npx @kth/lms-scan -r

# Search tokens in the git history and check if they are valid:
npx @kth/lms-scan history a4f2e5...b445e51 --remote
```
