# Tapo Control Viewer
Simple HA custom card to view tapo-control's cold file within HA.

# Concept
Use Tapo Control to save "cold files" in a media directory accessible within Home Assistant.
Add this card, point to the root of the cold files directory.

This custom card uses the thumbnails folder to fill the previews.
When the user clicks on a preview, the custom card loads the linked video into the player.

# Motivations
I've been using the "Gallery-Card" custom card for a while, but the preview of the videos always felt slow on mobile devices (iOS).
Started using the Tapo Control integration for my cameras, and thought the pregenerated thumbnails of the recordings could speed up the interface, so I stripped the code from Gallery-Card to its bare minimum, and modified it to work specifically with Tapo Control.

My miss likes it, so I thought others would too.

# Setup
Setup Tapo Control cold files to a path accessible within HomeAssistant, for example:
```
/media/Cameras/camera1
```
Setup HomeAssistant to serve those files (in configuration.yaml):
```
homeassistant:
   allowlist_external_dirs:
    - /media/
   media_dirs:
    recordings: /media/Cameras
```

Add the card to a dashboard.
Set tapo_control_storage_location attribute to the root of the Tapo Control cold files, for examle:
```
type: custom:tapo-control-viewer
tapo_control_storage_location: media-source://media_source/recordings/camera1/
```

Enjoy.

# Tips
Setup the card as a Panel, and when on a mobile device, it looks a bit like the Tapo app (video on top, previews list below).

# Credits
Well, obvously to TarheelGrad1998 for the Gallery-Card custom card this card is heavily based on:

https://github.com/TarheelGrad1998/gallery-card


And to JurajNyiri for the Tapo Control integration:

https://github.com/JurajNyiri/HomeAssistant-Tapo-Control
