'use client'

import React, { useState } from 'react'
import { MdClose, MdOpenInNew, MdDownload, MdRefresh, MdPictureAsPdf, MdErrorOutline } from 'react-icons/md'

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  url?: string | null
  title?: string | null
}

export default function PdfViewerModal({ isOpen, onClose, url, title }: PdfViewerModalProps) {
  const [loading, setLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)
  const [useDirectUrl, setUseDirectUrl] = useState(false)

  if (!isOpen) return null

  // Ensure clean URL format
  const documentUrl = url || ''
  const isDirectPdf = documentUrl.toLowerCase().includes('.pdf') || documentUrl.includes('r2.dev')
  const viewerUrl = useDirectUrl 
    ? documentUrl 
    : `https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Modal Header */}
        <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
              <MdPictureAsPdf className="text-xl" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base text-white truncate">
                {title || 'Publication Document'}
              </h3>
              <p className="text-xs text-gray-400 truncate">
                In-App Reader Mode · {documentUrl.split('/').pop() || 'document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Toggle Viewer Mode */}
            <button
              onClick={() => {
                setUseDirectUrl(!useDirectUrl)
                setLoading(true)
              }}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer"
              title="Switch PDF viewing engine"
            >
              <MdRefresh className="text-sm" />
              {useDirectUrl ? 'Use Google Viewer' : 'Direct Embed'}
            </button>

            {/* Open in New Tab */}
            {documentUrl && (
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                title="Open in new tab"
              >
                <MdOpenInNew className="text-xl" />
              </a>
            )}

            {/* Download Button */}
            {documentUrl && (
              <a
                href={documentUrl}
                download
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                title="Download document"
              >
                <MdDownload className="text-xl" />
              </a>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-red-600/30 transition-colors ml-1 cursor-pointer"
              title="Close modal"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex flex-col items-center justify-center">
          {!documentUrl ? (
            <div className="p-8 text-center max-w-md">
              <MdErrorOutline className="text-5xl text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-700">No Document File Available</h4>
              <p className="text-sm text-gray-500 mt-1">This publication entry does not have a linked PDF file or document URL.</p>
            </div>
          ) : (
            <>
              {loading && (
                <div className="absolute inset-0 bg-gray-50 z-10 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600 font-medium">Loading document viewer...</p>
                </div>
              )}

              <iframe
                src={viewerUrl}
                className="w-full h-full border-none"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false)
                  setIframeError(true)
                }}
                title={title || 'Document Viewer'}
              />

              {iframeError && (
                <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-6 text-center">
                  <MdErrorOutline className="text-5xl text-amber-500 mb-3" />
                  <h4 className="text-lg font-semibold text-gray-800">Unable to preview document inline</h4>
                  <p className="text-sm text-gray-500 max-w-md mt-1 mb-4">
                    The document server restricts inline frame embedding. You can download or open it directly in a new browser tab.
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 transition-all shadow-xs"
                    >
                      Open Document
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
