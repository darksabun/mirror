document.addEventListener("DOMContentLoaded", function () {
  getJSON(
    document.querySelector("meta[name=bmstable]").getAttribute("content"),
    function (header) {
      getJSON(header.data_url, function (information) {
        makeBMSTable(information);
      });
    }
  );
});

function getJSON(url, callback) {
  var req = new XMLHttpRequest();
  req.onload = function () {
    var data = JSON.parse(req.responseText);
    return callback(data);
  };
  req.open("GET", url, true);
  req.send(null);
}
