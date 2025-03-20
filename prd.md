# SumDrip

## About the app

This is a simple clone of services like StitchFix or ThreadBeast. The aim is to have a web app where users can signup/signin, fillout a profile form, upload a frontal image of themself, and a full body back image of themself. Upon doing so they will wait for messages from the wardrobe specialist.

Conversely, the wardrobe specialist, will login, and view the list of users they can chat with.

The idea is that this application is for a single wardrobe specialist that is looking for an app to help them with their clients.

## Frontend development

The application is a client-side-only using react, react router, daisyui 5, tailwindcss 4.

The overall theme of this app is stylish, urban, energetic and fun. The colors, and copy should reflect that.

## Pages

The application consists of the following pages:

- layout: The general layout of the app is navbar, page, footer. So every page has a navbar and footer.
- /: This is the home page, it is a landing page with a beautiful header/hero area and a features area. The main area on this page has a link to "Get Started" which will direct the user to the /describe-self page
- /describe-self: This page is where the user describes who they are and they style of clothes they like. The first section lists out several personality traits as badges. examples include: "shy", "social butterfly", "homebody", "funny", "professional", etc. There should be about 20 of these and the user can select all that apply. The next section simply says "Tell us your dimensions" and has various input fields for height, weight, waist, inseam, bust, hips, etc. Height, weight, waist, and inseam are required. Others are optional. After this area is simply an area where they can provide their instagram handle so the wardrobe artist can better get a sense of their style. The last area is simply an open ended textarea whey they can put in any additional details such as what they'd like to get out of this service. When the user clicks submit, the values are logged out and the user is directed to the /profile-pics page
  /profile-pics: this page is where the user can upload photos of themselves. There are two file input areas that accept photos. The first one is for them to upload a full body frontal image. The next is for them to half-body frontal image. They should be directed to use a well lit area. clicking continue logs the file contents and takes the user to the /thank-you page.
  /thank-you: This page simply thanks the customer for and let's them know they can chat with their wardrobe artist by clicking "View Chat". Clicking this takes the user to the /chat page.
  /chat: This page is a chat area where users can send text and images to one another. As a user, this is all you can see. However as a wardrobe artists, there is a sidebar where you can view their frontal images. Additionally, in the sidebar area you can upload a picture. In doing so, a new picture is generated (use a mock image) and that picture can be sent to the chat by clicking a button.
