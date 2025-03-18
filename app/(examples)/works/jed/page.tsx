'use client'

import { Asemic, AsemicCanvas } from '@/libs/asemic/src'
import { useEventListener } from '@/services/client-functions'
import { range, sample } from 'lodash'
import { useRef, useState } from 'react'

const text = `Access to the archive: in terms of random access.

One moment. Categorization. The systems behind one field. 

It's argumentative, contingent. 

One archival system is one of non-archiving: of systems outside of control, emergent systems. Self-archives, generative archives.

Pinballs, magnets: entities that attract and group.

This is one archive: a pattern of shifting and grouping, the visual pixels, charged particles, engaging into faces.

The phase after introduction, when you enter into the archive, and the face of the archivist is that which references its depths. The art of following.

The metaphor of the gravestone. A layer of delay. 

One way or the other.

There's a rock with your name on it.

Writing is refraction.

Someone spraypainted it. The background is black and the letters are white.

It's a community rock.

They changed your name. The “j” retwisted towards “P”, the “d” into “g”.

“Peg”.

It was “Peg”’s birthday probably.

“Happy Birthday Peg”.

I told them the rock was for the head of my department. He passed from cancer last month. He was my advisor.

They asked “is there a sign?” I asked them just to think about it.

I circled the rock. “Peg” had a chicken. And a house. And two children with three-fingered hands.

They didn't even bother to erase. “Peg”’s letters stretching down and up yours, superimposed, with the double e, double entendre, in the middle, “Peg”’s voiced, yours not.

How were they to know? I left them writing all over it.

People here seem to circle your death. It lives in ellipsis.

The rock shines, layered with decades of spraypaint. Children, chicken, name.

Maybe you did have a chicken. I know you had a child, two.

“jed”, “Peg”, “jeg”, “Pej”, “jPeg”, “jPegd”. I took a picture, to commemorate.

You didn't want a memorial.

James and I repainted the rock. It's a community rock. It's ours.

We were going to spraypaint the black back and replace your name in white.

You concluded, "We can identify impressive moments we have witnessed or imagined, work them into dynamic images, and use them to organize our attitude toward life and death. Similarly, we can always rethink the limits of who and where we are. We have always been connected to so much—our loved ones, people who have died already, our childhood, our past and future selves, our past and future places—that we can always think about new ways to belong to them."

You lived in words.

You live in words.

The rock is over there, its words a postscript to students passing on the path.

I want to publish this, for you—for me—for us. I want to call it “letters.” That's what it is.

In neon blue, your letters blended into white, someone has written on the rock, “Happy Birthday.”`.toLowerCase()

const paragraphs = text.split('\n\n')

export default function Page() {
  const scene = useRef(0)

  useEventListener('click', () => {
    scene.current++
  })

  return (
    <div>
      <AsemicCanvas dimensions={['100vw', '100vh']}>
        <Asemic>
          {(b) => {
            b.groups.forEach((g) => {
              console.log('disposing:', g)
              g.dispose()
            })
            b.groups = []
            b.repeat(5, (i) =>
              b.newGroup(
                'line',
                (g) => {
                  const thisText = paragraphs[scene.current].split(' ')
                  const thisWord = sample(thisText)!
                  g.newText(
                    thisWord,
                    {
                      reset: true,
                      thickness: () => g.getRandomWithin(3, 15),
                      alpha: () => g.getRandomWithin(0.3, 1),
                    },
                    {
                      left: g.getRandomWithin(0, 0.25),
                      width: g.getRandomWithin(0.25, 0.75),
                      middle: g.getRandomWithin(0.25, 0.75) * g.h,
                    },
                  )
                },
                { renderInit: () => Math.random() * 2000, maxCurves: 50 },
              ),
            )
            return <></>
          }}
        </Asemic>
      </AsemicCanvas>
    </div>
  )
}
