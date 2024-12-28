'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface PhotoHandlerProps {
  onImageCapture: (imageData: string) => void
  currentImage: string | null
}

export default function PhotoHandler({ onImageCapture, currentImage }: PhotoHandlerProps) {
  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isBrowser, setIsBrowser] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [imageSource, setImageSource] = useState<'camera' | 'upload' | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsBrowser(true)
    // Check if device is mobile
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Image = reader.result as string
        onImageCapture(base64Image)
        setImageSource('upload')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTakePhoto = () => {
    if (isMobile) {
      // On mobile, use the file input with capture="environment"
      fileInputRef.current?.click()
    } else {
      // On desktop, use our custom camera implementation
      startCamera()
    }
  }

  const startCamera = async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { exact: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current!.play()
                .then(() => resolve(true))
                .catch(() => {
                  console.error('Error playing video')
                  setCameraError('Failed to start video stream')
                })
            }
          }
        })
      }
      setShowCamera(true)
    } catch {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => {
                videoRef.current!.play()
                  .then(() => resolve(true))
                  .catch(() => {
                    console.error('Error playing video')
                    setCameraError('Failed to start video stream')
                  })
              }
            }
          })
        }
        setShowCamera(true)
      } catch (fallbackErr) {
        console.error('Camera Error:', fallbackErr)
        setCameraError('Unable to access camera. Please check permissions.')
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
    setCameraError(null)
  }

  const captureImage = () => {
    if (videoRef.current) {
      try {
        // Make sure video is actually playing and has dimensions
        if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) {
          throw new Error('Video stream not ready')
        }

        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          throw new Error('Could not get canvas context')
        }

        // Add error checking for video readiness
        if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
          throw new Error('Video stream not ready for capture')
        }

        // Draw the current video frame
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        
        // Convert to base64 with error checking
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        if (!imageData || imageData === 'data:,') {
          throw new Error('Failed to capture image data')
        }

        onImageCapture(imageData)
        setImageSource('camera')
        stopCamera()
      } catch (err) {
        console.error('Capture Error:', err)
        setCameraError(`Failed to capture image: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  return (
    <div className="space-y-3">
      {!showCamera ? (
        <div className="flex gap-4 justify-center">
          {isBrowser && (
            <>
              {/* Hidden file inputs remain the same */}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden" 
                id="plant-upload"
              />
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden" 
              />
              
              {/* Camera Button */}
              <button
                onClick={handleTakePhoto}
                className="w-24 h-24 flex flex-col items-center justify-center 
                  bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                  hover:shadow-xl hover:-translate-y-1 
                  transition-all duration-300
                  border-2 border-green-500/10 dark:border-green-500/20"
                title="Take Photo"
              >
                <svg 
                  className="w-8 h-8 text-green-600 dark:text-green-500 mb-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                {currentImage && imageSource === 'camera' && (
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mt-1"></div>
                )}
              </button>

              {/* Upload Button */}
              <label 
                htmlFor="plant-upload" 
                className="w-24 h-24 flex flex-col items-center justify-center 
                  bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                  hover:shadow-xl hover:-translate-y-1 
                  transition-all duration-300 cursor-pointer
                  border-2 border-green-500/10 dark:border-green-500/20"
                title="Upload Image"
              >
                <svg 
                  className="w-8 h-8 text-green-600 dark:text-green-500 mb-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                {currentImage && imageSource === 'upload' && (
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mt-1"></div>
                )}
              </label>
            </>
          )}
        </div>
      ) : (
        isBrowser && (
          <div className="space-y-3">
            <div className="relative aspect-[4/3] w-full bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <p className="text-white text-center px-4">{cameraError}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={stopCamera}
                className="flex-1 py-1.5 px-3 
                  bg-gray-500 dark:bg-gray-700 text-white rounded-lg 
                  hover:bg-gray-600 dark:hover:bg-gray-600 
                  transition-colors duration-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={captureImage}
                className="flex-1 py-1.5 px-3 
                  bg-green-500 dark:bg-green-600 text-white rounded-lg 
                  hover:bg-green-600 dark:hover:bg-green-500 
                  transition-colors duration-300 text-sm"
              >
                Capture
              </button>
            </div>
          </div>
        )
      )}

      {currentImage && !showCamera && isBrowser && (
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden 
          bg-gray-100 dark:bg-gray-800 transition-colors duration-200">
          <Image 
            src={currentImage} 
            alt="Uploaded plant" 
            fill 
            className="object-contain"
          />
        </div>
      )}
    </div>
  )
} 