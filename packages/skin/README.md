[![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/f1364dca/eBay-Skin)

# Skin

> Pure CSS framework designed & developed by eBay for a branded, e-commerce marketplace.

Please visit the [Skin website](https://opensource.ebay.com/evo-web/skin/) for all end-user documentation.

## License

Skin is [MIT](LICENSE) licensed.

## Install

Skin is available as the `@ebay/skin` package on [NPM](https://www.npmjs.com/).

## Versioning

Skin follows [Semantic Versioning](http://semver.org):

1. MAJOR version when we make incompatible API changes,
1. MINOR version when we add functionality in a backwards-compatible manner
1. PATCH version when we make backwards-compatible bug fixes.

More detailed insight into our versioning process can be found in our [contributing guide](CONTRIBUTING.md).

## Releases

Please refer to our [releases](https://github.com/eBay/evo-web/releases) page to view the change log for current and past releases.

Please refer to our [web archive](https://opensource.ebay.com/evo-web/skin/archive/) for past examples and documentation.

## Roadmap

Please refer to our [projects](https://github.com/eBay/evo-web/projects) page to see what's coming down the pipeline.

## Browser Support

Please view our [@ebay/browserslist-config](https://github.com/eBay/browserslist-config/blob/master/index.js) to see which browsers we currently support.

_SPOILER_: we do not support IE10 or under.

## Accessibility (A11Y)

We take accessibility very seriously. Very seriously indeed. Therefore all modules are built in accordance to the <a href="https://ebay.gitbooks.io/mindpatterns/content/">eBay MIND Patterns</a>. These patterns, in turn, build on from the specifications provided by the <a href="https://w3c.github.io/aria-practices/">WAI-ARIA Authoring Practices</a>.

## Issues

Please use our [issues page](https://github.com/eBay/evo-web/issues) to ask questions, report issues or submit feature requests.

To help track your issue, the Skin admins will assign it with a label from one or more issue categories.

## Custom Bundler

Skin provides a command to create your own bundles for uploading to cdn. Use `bin/generate-bundle.js` in order to create separate bundles.

`bin/generate-bundle.js list` -> List available modules (used for the --modules argument)

`bin/generate-bundle.js bundle ebay` -> Create a bundle under the ebay folder

`bin/generate-bundle.js bundle ebay --modules button carousel` -> Create a bundle under the ebay folder with only button and carousel modules

`bin/generate-bundle.js bundle ebay --scope-class ebay --scope-specificity 5` -> Create a bundle under the ebay folder with all CSS styles wrapped under `.ebay.ebay.ebay.ebay.ebay {}`

## Developing &amp; Contributing

Interested in contributing? Head over to our [contributing guide](CONTRIBUTING.md) for information on how to get started.

Contributions don't have to be code! They can be ideas, inspiration, discussion or filing bugs!

## People

The original creator of Skin is [Senthil Padmanabhan](https://github.com/senthilp).

The current author and lead maintainer is [Ian McBurnie](https://github.com/ianmcburnie).

[List of all contributors](https://github.com/eBay/evo-web/graphs/contributors).
