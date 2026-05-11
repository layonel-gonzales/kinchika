Análisis de color de fondo (segunda sección)
El fondo de la segunda sección (después del video hero) está compuesto por capas fijas:

Capa	Color/efecto
#deep-bg (fijo)	#000000 puro (linear-gradient todo negro)
html/body base	--abyss-0: #03070d (negro con tinte marino muy sutil)
#caustics	Teal/cyan rgba en blend mode screen, opacidad 0.18
#bubbles-canvas	Blend mode screen, opacidad 0.45
Color efectivo visible: #000000 a #03070d — negro casi puro con un destello de azul-teal muy tenue.

Prompts para generar videos con IA
Para que el video se integre perfectamente, el fondo debe ser negro puro (#000000). Así no se nota ninguna costura con el fondo de la página.

Prompt 1 — Cardumen horizontal (para Sora, Runway Gen-3, Kling, Pika)

Cinematic underwater shot, ultra-dark deep ocean, pure black background (#000000), 
photorealistic. A school of Chilean jurel (Trachurus murphyi) — jack mackerel — 
glides smoothly from left to right across the frame in a tight, synchronized shoal. 
Fish are silver-bodied with subtle iridescent blue highlights, gently lit by faint 
caustic light rays from above in cold teal (#00e6c8) and ocean blue tones. 
Particles of plankton drift slowly. No bottom, no surface visible. 
Seamless horizontal movement, moderate speed. 
16:9 widescreen, cinematic grade, no text, no UI, suitable for seamless loop.


Prompt 2 — Peces individuales traversando la pantalla (más dramático)

Cinematic deep ocean footage, black void background, 4K underwater photography style. 
Three large Chilean reineta (Brama australis) swim slowly and majestically from right 
to left across a perfectly dark (#03070d) frame. Their silver scales catch faint beams 
of bioluminescent teal light. Motion is fluid and ethereal. Camera static, fish move 
horizontally. Cold color palette: deep navy, teal accents, gold shimmer on fish scales. 
Photorealistic, no artifacts, 16:9 aspect ratio, no captions, loop-friendly start and end.


Prompt 3 — Mix de fauna chilena (más variedad)

Ultra-cinematic underwater scene, pure black deep ocean background. Multiple species 
of Chilean native fish pass horizontally through frame: congrio (Genypterus chilensis), 
corvina (Cilus gilberti), and pejeperro (Semicossyphus darwini). Each species crosses 
slowly, one after another, illuminated only by cold blue-teal caustic light beams 
(color: rgba(0, 180, 200, 0.3)). Background: absolute black. 
Smooth horizontal camera or fish movement from left edge to right edge. 
Subtle plankton particles. Photorealistic render or real footage grade. 
16:9 widescreen, no HUD, no text, filmgrain optional, loop-ready.


Para integrar en la página sin que se note
El video deberá colocarse con:

background-color: #000000 en el contenedor
Sin bordes visibles
El video tendrá aspecto ratio 16:9 (igual que el hero)
Opcionalmente usar mix-blend-mode: screen si el fondo del video no es perfectamente negro