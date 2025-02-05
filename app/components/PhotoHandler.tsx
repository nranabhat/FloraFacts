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
        stopCamera()
      } catch (err) {
        console.error('Capture Error:', err)
        setCameraError(`Failed to capture image: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  return (
    <div className="space-y-4">
      {!showCamera ? (
        <div>
          {!currentImage && (
            <div className="text-center mb-8">
              <p className="text-2xl text-green-800 dark:text-green-400 font-medium mb-3">
                Let's identify your plant! 🌿
              </p>
            </div>
          )}
          
          {isBrowser && (
            <div className="flex flex-col items-center gap-4">
              {/* Hidden file inputs remain unchanged */}
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
              
              {!currentImage && (
                <>
                  {/* Camera Button */}
                  <button
                    onClick={handleTakePhoto}
                    className="group w-64 h-32 flex flex-col items-center justify-center
                      bg-gradient-to-b from-green-50 to-white 
                      dark:from-gray-800 dark:to-gray-800/95
                      rounded-2xl shadow-lg 
                      hover:shadow-xl hover:-translate-y-1 
                      transition-all duration-300
                      border-2 border-green-100 dark:border-green-900"
                    title="Take Photo"
                  >
                    <span className="text-4xl mb-2" role="img" aria-label="camera">
                      📸
                    </span>
                    <span className="text-sm font-medium text-green-800 dark:text-green-400 
                      group-hover:text-green-600 dark:group-hover:text-green-300
                      transition-colors">
                      Take a Photo
                    </span>
                  </button>

                  {/* Or Divider */}
                  <div className="flex items-center gap-4 w-64 my-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 dark:via-green-800 to-transparent"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium">or</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 dark:via-green-800 to-transparent"></div>
                  </div>

                  {/* Upload Button */}
                  <label 
                    htmlFor="plant-upload" 
                    className="group w-64 h-32 flex flex-col items-center justify-center
                      bg-gradient-to-b from-green-50 to-white 
                      dark:from-gray-800 dark:to-gray-800/95
                      rounded-2xl shadow-lg 
                      hover:shadow-xl hover:-translate-y-1 
                      transition-all duration-300 cursor-pointer
                      border-2 border-green-100 dark:border-green-900"
                    title="Upload Image"
                  >
                    <span className="text-4xl mb-2" role="img" aria-label="upload">
                      🌱
                    </span>
                    <span className="text-sm font-medium text-green-800 dark:text-green-400 
                      group-hover:text-green-600 dark:group-hover:text-green-300
                      transition-colors">
                      Upload from Device
                    </span>
                  </label>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        isBrowser && (
          <div className="space-y-3">
            <div className="relative aspect-[4/3] w-full bg-black rounded-xl overflow-hidden
              border-2 border-green-100 dark:border-green-900">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <p className="text-white/90 text-center px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
                    {cameraError}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={stopCamera}
                className="flex-1 py-2 px-4
                  bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                  rounded-lg border border-gray-300 dark:border-gray-600
                  hover:bg-gray-200 dark:hover:bg-gray-600 
                  transition-all duration-300 text-sm"
              >
                ↩️ Cancel
              </button>
              <button
                onClick={captureImage}
                className="flex-1 py-2 px-4
                  bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400
                  rounded-lg border-2 border-green-100 dark:border-green-900
                  hover:bg-green-100 dark:hover:bg-green-900/50
                  transition-all duration-300 text-sm"
              >
                📸 Capture
              </button>
            </div>
          </div>
        )
      )}

      {currentImage && !showCamera && isBrowser && (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden 
          border-2 border-green-100 dark:border-green-900 
          bg-gradient-to-b from-green-50 to-white 
          dark:from-gray-800 dark:to-gray-800/95
          shadow-lg">
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