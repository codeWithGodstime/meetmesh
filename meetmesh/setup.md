## Models

USER
 - username
 - email
 - password
 - first name
 - lastname
 - lat
 - long
 - last_updated_location

Profile
    - profile_picture
    - bio
    - is_online
    - last_seen
    - location_visibility
    - linkedin url
    - twitter_url
    - facebook_url
    - others..
    - occupation
    

Notification Setting
 - notify_on_proximity
 - notifify_radius_km


Notification
 - receiver
 - sender
 - type
 - is_read
 - metadata


Message
 - content
 - sender
 - is_read
 - conversation


Conversion
 - participants(M2M)


## TODO

1. intergrate user authentication 
    - setup react project
    - password reset
    - change password
    - user profile update
    - notification settings
    - login
    - register
    - profile customization page on signup
    - setup user country field on the model
    - build landing page
    - term and condition page