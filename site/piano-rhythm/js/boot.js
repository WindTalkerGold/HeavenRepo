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
    notice.textContent = "游戏初始化失败，请刷新页面或更新浏览器。错误：" +
      (error.message || String(error));
    console.error("Piano Rhythm initialization failed:", error);
  });
})();
