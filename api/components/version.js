{
  name:"hl2reboot.api",
  version_api:"3.0"
}

{
  name:"hl2reboot.vercel.app",
  version_site:"5.0"
}

// Create the event
var event = new CustomEvent("verison", { "detail": "Test verison" });

// Dispatch/Trigger/Fire the event
document.dispatchEvent(event);

var event; // The custom event that will be created
if(document.createEvent){
    event = document.createEvent("HTMLEvents");
    event.initEvent("version", true, true);
    event.eventName = "version";
    element.dispatchEvent(event);
} else {
    event = document.createEventObject();
    event.eventName = "verison";
    event.eventType = "verison";
    element.fireEvent("on" + event.eventType, event);
}

// Add an event listener
document.addEventListener("name-of-event", function(e) {
  console.log(e.detail); // Prints "Example of an event"
});
