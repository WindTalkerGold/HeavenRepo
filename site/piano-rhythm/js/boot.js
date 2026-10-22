// A separate classic script can report module fetch/parse/initialization errors
// even when app.mjs never gets far enough to bind any buttons.
(function () {
  var notice = document.getElementById("notice");
  var start = document.getElementById("start");
  var timer = setTimeout(function () {
    notice.textContent = "游戏加载较慢，请检查网络；若一直无法开始，请刷新页面。";
  }, 10000);

  import("./app.mjs").then(function () {
    clearTimeout(timer);
    notice.textContent = "";
  }).catch(function (error) {
    clearTimeout(timer);
    start.disabled = true;
    start.textContent = "游戏加载失败";
    var detail = error && error.message ? error.message : String(error);
    // A module that fails to resolve its own exports almost always means the
    // browser kept an old cached copy after the files were updated.
    var splitCache = /does not provide an export|Failed to fetch dynamically imported module|Importing a module script failed/i.test(detail);
    notice.textContent = "游戏初始化失败，" +
      (splitCache
        ? "请强制刷新页面（Ctrl / ⌘ + Shift + R）；仍失败请检查网络或更新浏览器。"
        : "请刷新页面或更新浏览器。") +
      "错误：" + detail;
    console.error("Piano Rhythm initialization failed:", error);
  });
})();
