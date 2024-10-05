"use client";
import { DragEvent, ChangeEvent, useEffect } from "react";
import { useState, useRef } from "react";
import { Icon } from '@iconify/react'

export default function Home() {

  const [images, setImages] = useState<File[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [imageDetails, setImageDetails] = useState<{name: string; size: string}[]>([]);
  const [imageUuids, setImageUuids] = useState<string[]>([])
  const [isCopyButtonActive, setIsCopyButtonActive] = useState<boolean>(false);
  const [copyButtonIconName, setCopyButtonIconName] = useState('tabler:copy')
  const [origin, setOrigin] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, [])

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const newFiles = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (newFiles.length > 0) {
      setImages(prevImages => [...prevImages, ...newFiles]);
      setImageDetails(prevDetails => [...prevDetails, ...newFiles.map(file => ({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`}))])
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(true)
  }

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []).filter(file => file.type.startsWith('image/'))
    if (newFiles.length > 0) {
      setImages(prevImages => [...prevImages, ...newFiles]);
      setImageDetails(prevDetails => [...prevDetails, ...newFiles.map(file => ({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`}))])
    }
  }

  const handleUpload = async () => {
    if (images.length > 0) {
      const formData = new FormData()
      images.forEach(image => formData.append('files', image));

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json()
          setImageUuids(data.uuids)

          setImages([]);
          setImageDetails([]);

          // alert("Image uploaded successfully!" + imageUuid);
          dialogRef.current?.showModal()
          dialogRef.current?.classList.add('animate-popup')
          dialogRef.current?.classList.remove('animate-fadeOut')
        } else {
          alert("Failed to upload image");
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert("Error uploading image.")
      }
    }
  }

  const handleLinkCopy = () => {
    setIsCopyButtonActive(true);

    window.navigator.clipboard.writeText(origin + '/api/image/' + imageUuids[0]);

    setTimeout(() => {
      setIsCopyButtonActive(false);
    }, 3000);
  }

  const handleCancel = () => {
    setImages([]);
    setImageDetails([]);
  }

  const truncateMiddle = (str: string, maxLength: number) => {
    if (str.length <= maxLength) return str;
    const start = str.slice(0, Math.ceil(maxLength / 2));
    const end = str.slice(-Math.floor(maxLength / 2));
    return `${start}...${end}`;
  }

  const dialogClose = async () => {
    await setTimeout(() => {
      dialogRef.current?.close()
    }, 90);
    dialogRef.current?.classList.add('animate-fadeOut');
    dialogRef.current?.classList.remove('animate-popup');
  }

    const copyButtonHandleClick = async (imageUuid: String) => {
        await navigator.clipboard.writeText(origin + '/api/image/' + imageUuid)

        setCopyButtonIconName('tabler:copy-check');

        setTimeout(() => {
            setCopyButtonIconName('tabler:copy');
        }, 2000);
    }


  return (
    <>
      <div className="relative flex flex-col w-full h-[36rem] shadow-xl my-3" style={{ maxWidth: "min(64rem, calc(100vw - 4rem))" }}>
        <div className="flex h-16 bg-orange-200 border-t-4 border-l-4 border-r-4 border-orange-200 rounded-t-lg items-center font-extrabold text-orange-600 text-2xl">
          <span className="flex ml-4">Dawn Pic</span>

          {images.length ?
            <div className="ml-auto mr-4 space-x-4">
              <button
                className="transition-all bg-green-400 text-green-600 px-2 py-1 rounded-sm shadow-sm hover:brightness-95 active:brightness-90"
                onClick={handleUpload}>
                Upload
              </button>
              <button
                className="bg-red-400 text-red-600 px-2 py-1 rounded-sm shadow-sm hover:brightness-95 active:brightness-90"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            :
            <></>
          }
        </div>
        <div
          className={`flex flex-grow transition-all border-b-4 border-l-4 border-r-4 border-dashed border-gray-300 rounded-b-lg text-center cursor-pointer hover:backdrop-brightness-90 active:backdrop-brightness-75 ${isDraggingOver ? 'backdrop-brightness-90' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          {images.length ?
            (
              <div className="grid grid-cols-4 grid-rows-2 w-full">
                {images.map((image, index) => (
                  <div key={index} className="flex w-full h-full relative border border-dashed border-orange-200">
                    <img src={URL.createObjectURL(image)} className="flex rounded object-cover w-48 h-48 mx-auto my-auto brightness-50" />
                    <p className="absolute bottom-0 left-0 right-0 m-auto font-extrabold text-green-300">
                      { truncateMiddle(imageDetails[index]?.name || '', 20) }
                    </p>
                    <p className="absolute bottom-1/2 left-0 right-0 m-auto font-extrabold text-3xl text-orange-300">
                      {imageDetails[index]?.size}
                    </p>
                  </div>
                ))}
              </div>
            )
            :
            (<p className="text-orange-200 font-extrabold text-4xl m-auto">Drop or select your images here</p>)
          }
        </div>

        <dialog
          ref={dialogRef}
          className="relative bg-green-600 top-0 bottom-0 w-[48rem] h-[26rem] rounded shadow backdrop-brightness-50"
        >
          {
            imageUuids.length === 1 ? (
            <div className="flex w-full h-full">
              <div className="flex py-2 bg-green-300 text-green-600 font-extrabold rounded-t text-2xl">
                <span className="my-auto mx-4">Image Uploaded Successfully!</span>
              </div>
              <div className="flex justify-center flex-col">
                <div className="rounded ring-1 ring-green-300 mx-2 text-green-300 text-xl ">
                  <div className="w-full font-bold py-2 px-1 ring-1 ring-green-300 rounded">image link</div>
                  <div className="text-green-200 px-1 font-mono">{origin + '/api/image/' + imageUuids[0]}</div>
                </div>
                <button
                  onClick={handleLinkCopy}
                  className="transition-all rounded ring-1 ring-green-300 mx-2 py-3 my-2 text-green-300 font-extrabold text-xl hover:backdrop-brightness-95 active:backdrop-brightness-90">
                  {isCopyButtonActive ? "Link Copied ✔" : "Copy Link"}
                </button>
              </div>

              <button
                onClick={dialogClose}
                className="transition-all absolute right-3 top-2 p-2 rounded hover:backdrop-brightness-95 active:backdrop-brightness-90">
                <Icon icon="icon-park-solid:error" className="text-green-400 text-3xl"></Icon>
              </button>
              </div>) : (
              <div className="flex flex-col w-full h-full">
                <div className="sticky top-0 flex py-2 w-full bg-green-300 text-green-600 font-extrabold rounded-t text-2xl">
                  <span className="flex my-auto mx-4">Image Uploaded Successfully!</span>

                  <button
                    onClick={dialogClose}
                    className="flex transition-all ml-auto mr-2 rounded hover:backdrop-brightness-95 active:backdrop-brightness-90">
                    <Icon icon="icon-park-solid:error" className="text-green-400 text-3xl"></Icon>
                  </button>
                </div>

                <div className="flex flex-grow">
                  <div className="grid grid-rows-4 grid-cols-2 w-full h-full overflow-y-auto">
                    {imageUuids.map((imageUuid, index) => (
                      <div className="relative group flex w-full h-full items-center border border-dashed" key={index}>
                        <img className="ml-3 rounded object-cover h-20 w-20" src={`/api/image/${imageUuid}`} />
                        <div className="text-green-200 px-1 font-mono break-all">{origin + '/api/image/' + imageUuid}</div>

                        <button onClick={ () => copyButtonHandleClick(imageUuid) }>
                          <Icon icon={copyButtonIconName} className="transition-all absolute hidden w-10 h-10 text-green-400 bg-green-200/80 rounded bottom-1 right-2 group-hover:block hover:brightness-90 active:brightness-75" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          }
        </dialog>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
    </>
  );
}
