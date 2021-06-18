Object Cloud is a browser based game built using Javascript, HTML and CSS. 

Live link - https://wwirving.github.io/objectCloud/

CODING

The game is built using HTML canvas and a class orientated approach to game mechanics and design. Programming the game was a good opportuntiy to learn about object positioning and responsive design in canvas, which I've since implemented in other projects. On click, the mouse coordinate is overwritten with an event coordinate relative to the canvas width and height. In order to move the player an update function is called within the main animation loop of the program, which is also home to a larger function handling object movement. Moving the player around is achieved by iteratively subtracting the x/y coordinates of the Player object relative to the updated mouse position.

In terms of objects, each object exists within an array and is randomly spawned at the bottom of the screen, moves across using an iterative loop, and is then removed from the array (and screen) upon collision with player or passing the upper boundary of the window. The formula to calculate object-distance-from-player, Math.sqrt(dx * dx + dy * dy), where dx = object.x - player.x, made it easy to build logic around collision, for instance playing of sounds, increasing score, changing audio processing, or removing health points from the player. In order to add a procedural element to gameplay, I created two global density and feedback modulo's which control the release of objects and refresh-rate within the animation loop, both also responding to collision. 

AUDIO

The audio events for each object are handled by Howler.JS and then processed globally through Tuna.JS, allowing global control of reverb and delay. All game audio was synthesised and recorded in Ableton Live, with Gamelan samples sourced from the Omnisphere library. In particular, processing each audio event through a master-effect chain (convolution, delay, chorus) and automating these effects over time, gave a really great degree of control in the browser.

DESIGN

The skins for each object are sourced from gifs by <a src="http://www.ac-bu.info/">AC-BU studio</a>. The main character and design of the game were generated in Figma. The font used is Overwatch. Though designed to be played on desktop, the game also scales well to mobile and can be played continously between mobile and portrait modes.

Figma - https://www.figma.com/file/whuBO3fjVRNDoumeizE1jH/Object-Cloud?node-id=0%3A1
