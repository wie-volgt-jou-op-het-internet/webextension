let trackers = fetch(chrome.runtime.getURL('trackers.json')).then(res => res.json());

async function handleRequest(requestDetails) {
  const hostname = new URL(requestDetails.url).hostname;
  trackers = await trackers;
  for (const [tracker, trackerHostnames] of Object.entries(trackers)) {
    trackerHostnames.forEach(async trackerHostname => {
      if (hostname.endsWith(trackerHostname)) {
        await fetch(`http://localhost:9000/v1/set_state?name=${tracker}`)
        console.log(tracker)
        return true;
      }
    })
  }
  return false;
}


// Webnavigation workaround required because of bug in webrequest worker (cf. https://bugs.chromium.org/p/chromium/issues/detail?id=1024211).
chrome.webNavigation.onBeforeNavigate.addListener(() => {
  chrome.webRequest.onCompleted.addListener(handleRequest, { urls: ["*://*/*"] });
});