document.addEventListener("DOMContentLoaded", function() {
  var oldVersion = localStorage.getItem("APIVersion") || "";
  var currentVersion = "3.0";

  if (oldVersion !== currentVersion) {
    // Changes to the API version
    console.log("The API version has changed");
    alert("API Version 3.0");
    
    // Adding a new version to localStorage
    localStorage.setItem("APIVersion", currentVersion);
  }
});
