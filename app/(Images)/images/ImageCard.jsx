"use client";

import { useState, useRef, useEffect } from "react"
import { Icon } from "@iconify/react"

export default function ImageCard({ imageUuid, altInfo }) {
    const [copyButtonIconName, setCopyButtonIconName] = useState('tabler:copy')
    const [origin, setOrigin] = useState('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, [])

    const copyButtonHandleClick = async () => {
        await navigator.clipboard.writeText(origin + '/api/image/' + imageUuid)

        setCopyButtonIconName('tabler:copy-check');

        setTimeout(() => {
            setCopyButtonIconName('tabler:copy');
        }, 2000);
    }

    const emitImageDeleteEvent = () => {
        const event = new CustomEvent('deleteImage', {
            detail: { uuid: imageUuid }
        })

        document.dispatchEvent(event);
    }

    return (
        <>
            <div className='group flex relative sm:mt-3 my-2 sm:my-4 mx-0.5 sm:mx-0'>
                <img
                    src={`/api/image/${imageUuid}`}
                    alt={altInfo || 'Image'}
                    className='rounded relative shadow-md object-cover sm:w-60 sm:h-60 w-48 h-48 mx-auto'
                    loading='lazy'
                />
                <button onClick={copyButtonHandleClick}>
                    <Icon icon={copyButtonIconName} className="transition-all absolute hidden w-10 h-10 text-orange-400 bg-orange-200 rounded top-1 left-2 group-hover:block hover:brightness-90 active:brightness-75" />
                </button>

                <button onClick={emitImageDeleteEvent}>
                    <Icon icon='mdi:delete' className="transition-all absolute hidden w-10 h-10 text-orange-400 bg-orange-200 rounded top-1 left-14 group-hover:block hover:brightness-90 active:brightness-75" />
                </button>
            </div>
        </>
    )
}
