'use client'

import Section from '@/components/Section'
import { Processing } from 'reactive-frames'
import {
  defaultFragColor,
  defaultFragColorLegacy,
  defaultVert2D,
  defaultVert2DLegacy,
  shape
} from '@/services/utility-functions'
import _ from 'lodash'
import Link from 'next/link'
import { RefObject, useRef, useState } from 'react'
import { Reactive, CanvasGL, Snap, Mesh, Call, Hydra } from 'reactive-frames'

function DesignScene() {
  const [shader, setShader] = useState(defaultFragColorLegacy())

  return (
    <Reactive
      loop={true}
      className='absolute top-0 left-0 h-screen w-screen -z-10'>
      <CanvasGL name='mainCanvas' className='h-full w-full'>
        <Mesh
          name='mesh'
          useDefaults={false}
          fragmentShader={shader}
          vertexShader={defaultVert2DLegacy}
          attributes={{
            position: { data: [-1, 0, 0, -1, 1, 1], numComponents: 2 }
          }}
          draw={(self, gl, { time, elements }) => {
            self.draw({
              time: time / 1000,
              resolution: [gl.drawingBufferWidth, gl.drawingBufferHeight]
            })
          }}
        />
      </CanvasGL>
      <Hydra
        name='shader'
        className='h-full w-full hidden'
        setup={h => {
          setShader(h.noise(10, 190).glsl()[0].frag)
        }}></Hydra>
    </Reactive>
  )
}

export default function Client({ title }: { title: string }) {
  return (
    <>
      <div className='h-screen w-screen flex items-center justify-center relative'>
        <h1 className='text-h1 drop-shadow-lg'>{title}</h1>
        <DesignScene />
      </div>
      <Section innerClassName='flex justify-center py-8'>
        <Link
          href='/site-design/example'
          className='button text-h2 p-4'
          target='_blank'>
          View example site
        </Link>
      </Section>
      <Section innerClassName='relative flex flex-col'>
        <h2 className='text-h2 text-center'>Think outside the square.</h2>
        <Scene1 />
        <p className='text-center text-xl'>
          Site design tools make you pay extra for templates and fancy editors
          that put limits on your creativity.
        </p>

        <p className='text-center text-xl'>
          We use cutting-edge tools to create free-to-host, custom websites that
          will stand out from cookie-cutter competition.
        </p>
      </Section>
      <Section innerClassName='relative'>
        <h2 className='text-h2 text-center'>Tools</h2>
        <div
          className='sm:grid sm:grid-cols-3 sm:grid-rows-3'
          style={{
            gridTemplateAreas:
              '". illustration text1" "text2 illustration ." ". illustration text3"'
          }}>
          <Reactive
            loop={true}
            className='row-span-3 sm:h-full h-screen'
            style={{ gridArea: 'illustration' }}>
            <Processing
              type='p2d'
              name='canvas'
              width={300}
              height={600}
              className='!h-full !w-full'
              setup={(p, { props }) => {
                p.colorMode(p.HSL, 1)
                props.particles = _.range(30).map(() => ({
                  pos: 0,
                  spread: Math.random(),
                  color: Math.random(),
                  speed: Math.random() * 0.1 + 0.05,
                  start: Math.random() - 0.5
                }))
              }}
              draw={(p, { props: { particles } }) => {
                p.clear()
                p.noStroke()
                for (let particle of particles) {
                  p.fill(p.color(1, 1, 1, particle.color))
                  particle.pos +=
                    particle.speed *
                    p.height *
                    p.lerp(0.01, 0.1, (particle.pos / p.height) ** 2.5)
                  if (particle.pos > p.height + 50) {
                    particle.pos = 0
                  }
                  p.circle(
                    p.lerp(
                      0.5 * p.width + (particle.start * p.width) / 4.0,
                      particle.spread * p.width,
                      particle.pos / p.height
                    ),
                    particle.pos,
                    p.lerp(10, 50, particle.pos / p.height)
                  )
                }
              }}
            />
          </Reactive>
          <div style={{ gridArea: 'text1' }}>
            <h3>Content</h3>
            <p>
              We design a simple, accessible content platform where you can
              upload your bio, projects, images, blogs, and anything else you
              want—the format is yours to choose.
            </p>
            <p className='pt-4'>
              Our tool:{' '}
              <a href='https://www.sanity.io/' className='button'>
                Sanity.io
              </a>
            </p>
          </div>
          <div style={{ gridArea: 'text2' }} className='sm:*:text-right'>
            <h3>Design</h3>
            <p className=''>
              We code the site with cutting-edge web technologies that ensure
              optimal performance and infinite customizability.
            </p>
            <p className='pt-4'>
              Our tool:{' '}
              <a href='https://nextjs.org/' className='button'>
                Next.js
              </a>
            </p>
          </div>
          <div style={{ gridArea: 'text3' }}>
            <h3>Hosting</h3>
            <p>
              Forget monthly fees! Instead of a middleman, your site's code is
              uploaded directly to a secure and globally available server.
            </p>
            <p className='pt-4'>
              Our tool:{' '}
              <a href='https://vercel.com/' className='button'>
                Vercel
              </a>
            </p>
          </div>
        </div>
      </Section>
      <Section>
        <h2 className='text-h2 text-center'>Options</h2>
        <div className='sm:flex sm:*:w-1/3 sm:*:px-2 -sm:space-y-2 -sm:*:h-fit'>
          <div className='grow block'>
            <div className='bg-bg2 rounded-lg px-2 pb-2 h-full'>
              <h3 className='text-center h-fit'>Banner</h3>
              <Reactive
                loop={false}
                className='-sm:hidden w-full aspect-square'>
                <Snap
                  name='snap'
                  width={100}
                  height={100}
                  viewBox='0 0 100 100'
                  setup={s => {
                    const group = s.group()
                    for (let i = 0; i < 4; i++) {
                      const scale = 80 - i * 10
                      group.add(s.rect(10 + i * 5, 10 + i * 5, scale, scale))
                    }
                    group.attr({
                      stroke: 'white',
                      fill: 'transparent'
                    })
                  }}
                />
              </Reactive>

              <p>Integrate a background design into an existing site.</p>
            </div>
          </div>
          <div className='grow block'>
            <div className='bg-bg2 rounded-lg px-2 pb-2 h-full'>
              <h3 className='text-center'>Portfolio</h3>
              <Reactive
                loop={false}
                className='-sm:hidden w-full aspect-square'>
                <Snap
                  height={100}
                  width={100}
                  name='snap'
                  setup={s => {
                    const max = 15
                    const h = Number(s.node.getAttribute('height'))
                    const GAP = 10
                    const rect = s.group(
                      s.rect(
                        GAP / 2 + 0,
                        GAP / 2 + 0,
                        h / 2 - GAP,
                        h / 2 - GAP
                      ),
                      s.rect(
                        GAP / 2 + h / 2,
                        GAP / 2 + 0,
                        h / 2 - GAP,
                        h / 2 - GAP
                      ),
                      s.rect(
                        GAP / 2 + 0,
                        GAP / 2 + h / 2,
                        h / 2 - GAP,
                        h / 2 - GAP
                      ),
                      s.rect(
                        GAP / 2 + h / 2,
                        GAP / 2 + h / 2,
                        h / 2 - GAP,
                        h / 2 - GAP
                      )
                    )
                    rect.attr({
                      fill: 'white'
                    })
                  }}
                />
              </Reactive>
              <p>A portfolio site with a simple layout.</p>
            </div>
          </div>
          <div className='grow block'>
            <div className='bg-bg2 rounded-lg px-2 pb-2 h-full'>
              <h3 className='text-center'>Custom</h3>
              <div className='-sm:hidden w-full aspect-square'>
                <svg
                  className='-sm:hidden h-full w-full'
                  viewBox='0 -0.3 1.3 1.3'>
                  <g fill='white'>
                    {_.range(6).map(i => (
                      <rect
                        key={i}
                        x='0.1'
                        y={0.8 - (i * 0.3) / 6}
                        width={0.5}
                        height={0.3}
                        transform={`rotate(${(i / 6) * 90 * -1}, ${0.0}, ${0.2})`}
                        opacity={0.3 + (i / 6) * 0.7}
                      />
                    ))}
                  </g>
                </svg>
              </div>

              <p>
                A site with custom generative visuals and an interactive
                homepage with your story.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

function Scene1() {
  const position = useRef([0, 0])

  return (
    <Reactive
      loop={true}
      className='h-[100vw] sm:h-[30vw] w-full sm:w-fit sm:place-self-center'>
      <CanvasGL name='topLevel' className='object-fill w-full h-full'>
        <Mesh
          name='square'
          vertexShader={defaultVert2D}
          fragmentShader={defaultFragColor(1, 1, 1, 1)}
          attributes={{
            position: {
              data: shape('square').map(x => x / 2),
              numComponents: 2
            }
          }}
          draw={(self, gl) =>
            self.draw({
              resolution: [gl.drawingBufferWidth, gl.drawingBufferHeight]
            })
          }
        />
        <Mesh
          name='square2'
          vertexShader={
            /*glsl*/ `
            uniform vec2 positionMorph;
            uniform vec2 resolution;
            in vec2 position;
            
            void main() {
              vec2 posScale = (position + positionMorph * 0.2) * vec2(resolution.y / resolution.x, 1);
              gl_Position = vec4(posScale, 0, 1);
            }`
          }
          fragmentShader={defaultFragColor(1, 1, 1, 0.5)}
          attributes={{
            position: {
              data: shape('square').map(x => x / 2),
              numComponents: 2
            }
          }}
          draw={(self, gl) =>
            self.draw({
              positionMorph: position.current,
              resolution: [gl.drawingBufferWidth, gl.drawingBufferHeight]
            })
          }
        />
        <Call
          name='changePosition'
          deps={() => Math.random() ** 4 * 200}
          draw={() => {
            position.current = [Math.random() * 2 - 1, Math.random() * 2 - 1]
          }}></Call>
      </CanvasGL>
    </Reactive>
  )
}
