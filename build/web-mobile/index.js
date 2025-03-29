System.register(["./application.js"], function (_export, _context) {
  "use strict";

  var Application, canvas, $p, bcr, application;

  function topLevelImport(url) {
    return System["import"](url);
  }

  (function () {
    if (typeof window.jsb === "object") {
      var hotUpdateSearchPaths = localStorage.getItem("HotUpdateSearchPaths");
      if (hotUpdateSearchPaths) {
        var paths = JSON.parse(hotUpdateSearchPaths);
        jsb.fileUtils.setSearchPaths(paths);

        var fileList = [];
        var storagePath = paths[0] || "";
        var tempPath = storagePath + "_temp/";
        var baseOffset = tempPath.length;

        if (
          jsb.fileUtils.isDirectoryExist(tempPath) &&
          !jsb.fileUtils.isFileExist(tempPath + "project.manifest.temp")
        ) {
          jsb.fileUtils.listFilesRecursively(tempPath, fileList);
          fileList.forEach((srcPath) => {
            var relativePath = srcPath.substr(baseOffset);
            var dstPath = storagePath + relativePath;

            if (srcPath[srcPath.length - 1] === "/") {
              jsb.fileUtils.createDirectory(dstPath);
            } else {
              if (jsb.fileUtils.isFileExist(dstPath)) {
                jsb.fileUtils.removeFile(dstPath);
              }
              jsb.fileUtils.renameFile(srcPath, dstPath);
            }
          });
          jsb.fileUtils.removeDirectory(tempPath);
        }
      }
    }
  })();

  return {
    setters: [
      function (_applicationJs) {
        Application = _applicationJs.Application;
      },
    ],
    execute: function () {
      canvas = document.getElementById("GameCanvas");
      $p = canvas.parentElement;
      bcr = $p.getBoundingClientRect();
      canvas.width = bcr.width;
      canvas.height = bcr.height;
      application = new Application();
      topLevelImport("cc")
        .then(function (engine) {
          return application.init(engine);
        })
        .then(function () {
          return application.start();
        })
        ["catch"](function (err) {
          console.error(err);
        });
    },
  };
});
