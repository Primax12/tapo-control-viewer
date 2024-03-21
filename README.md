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
Add the card to a dashbaord.
Set tapo_control_storage_location attribute to the root of the Tapo Control cold files.
Enjoy.
