"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import withAuth from '../../withAuth'
import PaginationBar from './PaginationBar'
import ImageCard from './ImageCard'

const getUserImages = async (page) => {
    const response = await fetch('/api/userImages?page=' + page);
    const images = await response.json()

    return images
}

const Image = () => {
    const [images, setImages] = useState([])
    const [pageNumber, setPageNumber] = useState()
    const [currentImageUuid, setCurrentImageUuid] = useState()
    const searchParams = useSearchParams()
    const deleteDialogRef = useRef();

    const fetchImages = async () => {
        try {
            const imagesData = await getUserImages(pageNumber);
            setImages(imagesData);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }

    const handleDeleteImageCanceled = () => {
        setCurrentImageUuid(null)
        deleteDialogRef.current?.close()
    }

    const handleDeleteImageConfirmed = async (uuid) => {
        const response = await fetch('/api/image/' + uuid, {
            method: 'DELETE'
        })

        if (response.ok) {
            setCurrentImageUuid(null)
            await fetchImages()
            deleteDialogRef.current?.close()
        }
    }

    useEffect(() => {
        const handleDeleteImage = (e) => {
            setCurrentImageUuid(e.detail.uuid)
            deleteDialogRef.current?.showModal()
        }

        document.addEventListener('deleteImage', handleDeleteImage)

        return () => {
            document.removeEventListener('deleteImage', handleDeleteImage)
        }
    }, [])

    useEffect(() => {
        const page = searchParams.get('page');
        if (page !== null) {
            setPageNumber(parseInt(page, 10));
        } else {
            setPageNumber(1)
        }
    }, [searchParams])

    useEffect(() => {
        fetchImages()
    }, [pageNumber])

    return (
        <>
            <div className='relative flex flex-col mx-auto pt-5 px-3 rounded-t w-full max-w-3xl bg-orange-200 border-b-8 border-orange-600'>
                <div className='flex w-full'>
                    <span className='my-auto text-3xl font-extrabold text-orange-600'>My images</span>
                    <div className='ml-auto'>
                        <PaginationBar />
                    </div>
                </div>

                <div className='grid grid-cols-3'>
                    {images.map((image) => (
                        <ImageCard
                            key={image.imageUuid}
                            imageUuid={image.imageUuid}
                            altInfo={image.altInfo}
                        />
                    ))}
                </div>
            </div>

            <dialog
                ref={deleteDialogRef}
                className="w-[47rem] h-[26rem] top-0 bottom-0 bg-orange-300 rounded shadow-3xl backdrop-brightness-50"
            >
                <div className='flex flex-col w-full h-full'>
                    <div className='flex py-24 bg-orange-400 text-3xl font-extrabold text-orange-200 pl-2 rounded-t'>
                        Are you sure to delete this image?
                    </div>

                    <div className='flex flex-grow'>
                        <button onClick={() => handleDeleteImageConfirmed(currentImageUuid)} className='flex px-12 py-4 my-auto mx-auto bg-orange-400 text-orange-200 rounded font-extrabold text-3xl shadow'>
                            <span>Yes</span>
                        </button>

                        <button onClick={handleDeleteImageCanceled} className='flex px-8 py-4 my-auto mx-auto bg-green-400 text-green-200 rounded font-extrabold text-3xl shadow'>
                            <span>No</span>
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default withAuth(Image);
