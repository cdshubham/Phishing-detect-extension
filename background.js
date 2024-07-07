chrome.runtime.onMessage.addListener(function (prediction) {
  if (prediction == 1) {
    console.log("fish");
    alert("Warning: Phishing detected!!");
  } else if (prediction == -1) {
    console.log("chicken");
    alert("No phishing detected");
  }
});

