"use client";
import { useCallback, DragEvent, ChangeEvent, useEffect } from "react";
import { useState, useRef } from "react";
import { Icon } from '@iconify/react'

export default function Home() {

  const [image, setImage] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [imageDetails, setImageDetails] = useState<{name: string; size: string} | null>(null);
  const [imageUuid, setImageUuid] = useState<string>('')
  const [isCopyButtonActive, setIsCopyButtonActive] = useState<boolean>(false);
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
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImageDetails({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`})
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
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImageDetails({ name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`});
    }
  }

  const handleUpload = async () => {
    if (image) {
      const formData = new FormData()
      formData.append('file', image);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json()
          setImageUuid(data.uuid)

          setImage(null);
          setImageDetails(null);

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

    window.navigator.clipboard.writeText(origin + '/api/image/' + imageUuid);

    setTimeout(() => {
      setIsCopyButtonActive(false);
    }, 3000);
  }

  const handleCancel = () => {
    setImage(null);
    setImageDetails(null);
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

  return (
    <>
      <div className="relative flex flex-col w-[64rem] h-[36rem] m-auto shadow-xl">
        <div className="flex h-16 bg-orange-200 border-t-4 border-l-4 border-r-4 border-orange-200 rounded-t-lg items-center font-extrabold text-orange-600 text-2xl">
          <span className="flex ml-4">Dawn Pic</span>

          {image ?
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
          {image ?
            (
              <div className="flex relative mx-4 my-2 w-64 h-64 border-8 rounded border-orange-300 shadow">
                <img src={URL.createObjectURL(image)} className="flex object-cover w-full h-full brightness-50" />
                <p className="absolute bottom-0 left-0 right-0 m-auto font-extrabold text-green-300">
                  {truncateMiddle(imageDetails?.name || '', 20)}
                </p>
                <p className="absolute bottom-1/2 left-0 right-0 m-auto font-extrabold text-3xl text-orange-300">
                  {imageDetails?.size}
                </p>
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
          <div className="flex w-full h-full">
            <div className="flex py-2 bg-green-300 text-green-600 font-extrabold rounded-t text-2xl">
              <span className="my-auto mx-4">Image Uploaded Successfully!</span>
            </div>
            <div className="flex justify-center flex-col">
              <div className="rounded ring-1 ring-green-300 mx-2 text-green-300 text-xl ">
                <div className="w-full font-bold py-2 px-1 ring-1 ring-green-300 rounded">image link</div>
                <div className="text-green-200 px-1 font-mono">{origin + '/api/image/' + imageUuid}</div>
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
          </div>
        </dialog>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
