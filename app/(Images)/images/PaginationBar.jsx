"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';

export default function PaginationBar() {
    const [itemsCount, setItemsCount] = useState(0)
    const searchParams = useSearchParams()
    const currentPage = parseInt(searchParams.get('page')) || 1
    const [pageCount, setPageCount] = useState()
    const router = useRouter()

    useEffect(() => {
        const fetchItemsCount = async () => {
            try {
                const response = await fetch('/api/userImagesCount');
                const data = await response.json()
                setItemsCount(data.count)
            } catch (error) {
                console.error('Error fetching total items:', error);
            }
        }

        fetchItemsCount();
    }, [])

    useEffect(() => {
        setPageCount(Math.ceil(itemsCount/9))
    }, [itemsCount])

    const handlePageClick = (event) => {
        const newPage = event.selected + 1;
        router.push('/images?page=' + newPage)
    }

    return (
        <>
            <div className={pageCount>1?'':'invisible'}>
                <ReactPaginate
                    initialPage={currentPage - 1}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={1}
                    marginPagesDisplayed={1}
                    renderOnZeroPageCount={null}
                    containerClassName='flex'
                    activeClassName='bg-orange-700 !hover:bg-orange-700'
                    activeLinkClassName='text-orange-100'
                    previousClassName='flex w-16 h-8 sm:w-16 sm:h-12 m-1 bg-orange-400 rounded rounded-tr-xl hover:bg-orange-500'
                    previousLinkClassName='flex text-orange-100 w-full h-full items-center justify-center'
                    nextClassName='flex w-12 h-8 sm:w-16 sm:h-12 m-1 bg-orange-400 rounded rounded-tr-xl hover:bg-orange-500 active:bg-orange-600'
                    nextLinkClassName='flex w-full h-full items-center justify-center text-orange-100'
                    disabledClassName='invisible'
                    disabledLinkClassName='cursor-default'
                    pageClassName='flex sm:w-12 sm:h-12 w-8 h-8 m-1 bg-orange-400 rounded rounded-tr-xl hover:bg-orange-700'
                    pageLinkClassName='flex items-center justify-center w-full h-full text-orange-100'
                />
            </div>
        </>
    )
}
