const { PurgeCSS } = require("purgecss");
const CleanCSS = require("clean-css");
const htmlmin = require("html-minifier");
const { minify } = require("terser");

module.exports = function (eleventyConfig) {
  // CSS
  eleventyConfig.addTransform(
    "purge-and-inline-css",
    async (content, outputPath) => {
      if (
        process.env.ELEVENTY_ENV !== "prod" ||
        !outputPath.endsWith(".html")
      ) {
        return content;
      }

      const purgeCSSResults = await new PurgeCSS().purge({
        content: [{ raw: content }],
        css: ["./src/_includes/css/*.css"],
        keyframes: true,
      });

      // Unimos todos los ficheros CSS. ¡Ojo con el orden!
      let styles = "";
      for (let item of purgeCSSResults) {
        styles += item.css;
      }

      // Minificación de CSS
      let stylesMinified = new CleanCSS({
        level: { 1: { specialComments: false } },
      }).minify(styles);

      return content.replace(
        "<!-- INLINE CSS-->",
        "<style>" + stylesMinified.styles + "</style>"
      );
    }
  );

  // HTML Minify
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      outputPath &&
      outputPath.endsWith(".html") &&
      process.env.ELEVENTY_ENV === "prod"
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  // Filtro para minificar JS
  eleventyConfig.addNunjucksAsyncFilter(
    "jsmin",
    async function (code, callback) {
      try {
        const minified = await minify(code);
        callback(null, minified.code);
      } catch (err) {
        console.error("Terser error: ", err);
        // Fail gracefully.
        callback(null, code);
      }
    }
  );

  // Estructura de Carpetas
  return {
    dir: {
      input: "src",
      output: "_public",
    },
  };
};
