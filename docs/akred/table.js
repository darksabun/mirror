document.addEventListener("DOMContentLoaded", function () {
  var metaTag = document.querySelector("meta[name=bmstable]");
  if (!metaTag) return;

  getJSON(metaTag.getAttribute("content"), function (header) {
    getJSON(header.data_url, function (information) {
      makeBMSTable(information, header.symbol);
    });
  });
});

function getJSON(url, callback) {
  var req = new XMLHttpRequest();
  req.onload = function () {
    try {
      var data = JSON.parse(req.responseText);
      callback(data);
    } catch (e) {
      console.error("JSON Parse Error:", e);
    }
  };
  req.open("GET", url, true);
  req.send(null);
}

function makeBMSTable(info, mark) {
  var obj = document.getElementById("table_int");
  obj.innerHTML = "";

  var headerRow = document.createElement("tr");
  headerRow.style.height = "20px";
  headerRow.style.color = "white";
  headerRow.style.backgroundColor = "#666666";

  headerRow.innerHTML =
    "<td class='center-text'>LV</td>" +
    "<td class='center-text'>タイトル</td>" +
    "<td class='center-text'>本体</td>" +
    "<td class='center-text'>差分</td>" +
    "<td class='center-text'>コメント</td>";

  obj.appendChild(headerRow);

  var x = "";
  var count = 0;
  var obj_sep = null;

  Array.prototype.forEach.call(info, function (i) {
    if (x != i.level) {
      if (obj_sep != null) {
        obj_sep.innerHTML =
          "<td colspan='6' class='center-text'><b>" +
          mark +
          x +
          " (" +
          count +
          "譜面)</b></td>";
      }

      obj_sep = document.createElement("tr");
      obj_sep.className = "tr_separate";
      obj_sep.id = mark + i.level;
      obj.appendChild(obj_sep);

      count = 0;
      x = i.level;
    }

    var row = document.createElement("tr");

    if (i.state == 1) {
      row.className = "tr_new";
    } else if (i.state == 2) {
      row.className = "tr_update";
    } else {
      row.className = "tr_normal";
    }

    var astr = "";
    if (i.url) {
      if (i.artist) {
        astr = "<a href='" + i.url + "'>" + i.artist + "</a>";
      } else {
        astr = "<a href='" + i.url + "'>" + i.url + "</a>";
      }
    } else {
      if (i.artist) {
        astr = i.artist;
      }
    }

    if (i.url_pack) {
      if (i.name_pack) {
        astr += "<br />(<a href='" + i.url_pack + "'>" + i.name_pack + "</a>)";
      } else {
        astr += "<br />(<a href='" + i.url_pack + "'>" + i.url_pack + "</a>)";
      }
    } else {
      if (i.name_pack) {
        astr += "<br />(" + i.name_pack + ")";
      }
    }

    var diffStr = "";
    if (i.url_diff) {
      if (i.name_diff) {
        diffStr = "<a href='" + i.url_diff + "'>" + i.name_diff + "</a>";
      } else {
        diffStr = "<a href='" + i.url_diff + "'>右クリック保存</a>";
      }
    } else {
      if (i.name_diff) {
        diffStr = i.name_diff;
      }
    }

    row.innerHTML =
      "<td style='width: 5%'>" +
      mark +
      x +
      "</td>" +
      "<td style='width: 20%'><a href='http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" +
      i.md5 +
      "' target='_blank'>" +
      i.title +
      "</a></td>" +
      "<td style='width: 20%'>" +
      astr +
      "</td>" +
      "<td style='width: 10%'>" +
      diffStr +
      "</td>" +
      "<td style='width: 15%'>" +
      i.comment +
      "</td>";

    obj.appendChild(row);
    count++;
  });

  if (obj_sep != null) {
    obj_sep.innerHTML =
      "<td colspan='6' class='center-text'><b>" +
      mark +
      x +
      " (" +
      count +
      "譜面)</b></td>";
  }
}
