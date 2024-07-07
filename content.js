var testdata;
var prediction;

function predict(data) {
  var f = 0;
  for (var j = 0; j < data.length; j++) {
    console.log(data[j]);
    f += data[j];
  }
  if (f > 27) {
    console.log("wah");
    return 1;
  } else {
    console.log("are yaar");
    return -1;
  }
}

function isIllegalHttpsURL() {
  var url = window.location.href;
  if (url.startsWith("https://")) {
    console.log("NP");
    return 0;
  } else {
    console.log("P");
    return 10;
  }
}

function isImgFromDifferentDomain() {
  var totalCount = document.querySelectorAll("img").length;
  var identicalCount = getIdenticalDomainCount("img");
  if ((totalCount - identicalCount) / totalCount < 0.6) {
    console.log("NP");
    return 0;
  } else {
    console.log("P");
    return 1;
  }
}

function isAnchorFromDifferentDomain() {
  var totalCount = document.querySelectorAll("a").length;
  var identicalCount = getIdenticalDomainCount("a");
  if ((totalCount - identicalCount) / totalCount < 0.6) {
    console.log("NP");
    return 0;
  } else {
    console.log("P");
    return 1;
  }
}

function isScLnkFromDifferentDomain() {
  var totalCount =
    document.querySelectorAll("script").length +
    document.querySelectorAll("link").length;
  var identicalCount =
    getIdenticalDomainCount("script") + getIdenticalDomainCount("link");
  if ((totalCount - identicalCount) / totalCount < 0.6) {
    console.log("NP");
    return 0;
  } else {
    console.log("P");
    return 3;
  }
}

function isFormActionInvalid() {
  var totalCount = document.querySelectorAll("form").length;
  var identicalCount = getIdenticalDomainCount("form");
  if (document.querySelectorAll("form[action]").length <= 0) {
    console.log("NP");
    return 0;
  } else if ((totalCount - identicalCount) / totalCount < 0.6) {
    console.log("NP");
    return 0;
  } else {
    console.log("P");
    return 5;
  }
}

function isIframePresent() {
  if (document.querySelectorAll("iframe").length <= 0) {
    console.log("NP");
    return 0;
  } else {
    console.log("P");
    return 5;
  }
}

function getIdenticalDomainCount(tag) {
  var identicalCount = 0;
  var reg = /\/\/(.*?)\.com/;
  var url = window.location.href;
  var mainDomainMatch = url.match(reg);
  var mainDomain = mainDomainMatch ? mainDomainMatch[1] : null;
  if (!mainDomain) return identicalCount;

  console.log("mainDomain", mainDomain);
  var nodeList = document.querySelectorAll(tag);
  nodeList.forEach(function (element) {
    var i;
    if (tag === "img" || tag === "script") {
      i = element.src;
    } else if (tag === "form") {
      i = element.action;
    } else if (tag === "a" || tag === "link") {
      i = element.href;
    }

    if (i) {
      var elementDomainMatch = i.match(reg);
      var elementDomain = elementDomainMatch ? elementDomainMatch[1] : null;
      console.log("elementDomainMatch", elementDomain);
      if (elementDomain && elementDomain.includes(mainDomain)) {
        identicalCount++;
      }
    }
  });

  return identicalCount;
}

function domainChecking() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        const response = JSON.parse(this.responseText);
        console.log(response);
        if (response.body.da_score > 40) {
          console.log("Domain DA Score NP");
          resolve(0);
        } else {
          console.log("Domain DA Score P");
          resolve(20);
        }
      }
    });

    xhr.open(
      "GET",
      `https://domain-da-pa-check.p.rapidapi.com/?target=${window.location.href}`
    );
    xhr.setRequestHeader(
      "x-rapidapi-key",
      "ab4b861672msh5419af363549d62p1490f3jsn158cc35d9ac5"
    );
    xhr.setRequestHeader(
      "x-rapidapi-host",
      "domain-da-pa-check.p.rapidapi.com"
    );

    xhr.send(null);
  });
}

async function performCheck() {
  testdata = [
    isIllegalHttpsURL(),
    isImgFromDifferentDomain(),
    isAnchorFromDifferentDomain(),
    isScLnkFromDifferentDomain(),
    isFormActionInvalid(),
    isIframePresent(),
  ];

  const domainCheckResult = await domainChecking();
  testdata.push(domainCheckResult);

  prediction = predict(testdata);
  chrome.runtime.sendMessage(prediction);
}

performCheck();
