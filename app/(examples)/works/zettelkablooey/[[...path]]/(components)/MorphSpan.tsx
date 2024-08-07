import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'

export default function MorphSpan({ children }: { children: string }) {
  const [text, setText] = useState(children)

  useEffect(() => {
    const updateText = () => {
      setText(text => {
        if (!text) return ''
        const splitText = text.split(' ')
        const randomWord = _.random(splitText.length - 1)
        const splitWord = splitText[randomWord]
        const randomLetter = _.random(splitWord.length - 1)

        splitText[randomWord] =
          splitText[randomWord].slice(0, randomLetter) +
          _.sample('abcdefghijklmnopqrstuvwxyz') +
          splitText[randomWord].slice(randomLetter + 1)

        return splitText.join(' ')
      })
    }
    let currentTimeout: number
    if (text) {
      currentTimeout = window.setTimeout(updateText, _.random(1000))
    }
    return () => {
      currentTimeout && window.clearTimeout(currentTimeout)
    }
  }, [text])

  return (
    <span className='relative -z-10 mx-2 break-all opacity-50'>{text}</span>
  )
}
