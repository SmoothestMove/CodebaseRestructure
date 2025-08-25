import React, { useState, useRef } from 'react';
import { X, Paperclip, Upload, Download, Trash2, Eye, Link as LinkIcon, FileText, Image as ImageIcon, File } from 'lucide-react';
import { TaskAttachment } from '../types';
import Button from '@/components/common/Button';

interface TaskAttachmentsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: TaskAttachment[];
  onAddAttachment: (attachment: Omit<TaskAttachment, 'id' | 'uploadedAt'>) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  currentUserId?: string;
}

const TaskAttachmentsManager: React.FC<TaskAttachmentsManagerProps> = ({
  isOpen,
  onClose,
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  currentUserId
}) => {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        
        // Determine file type
        let type: TaskAttachment['type'] = 'other';
        if (file.type.startsWith('image/')) {
          type = 'image';
        } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) {
          type = 'document';
        }

        onAddAttachment({
          name: file.name,
          type,
          base64,
          size: file.size,
          mimeType: file.type,
          uploadedBy: currentUserId
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;

    let finalName = linkName.trim();
    if (!finalName) {
      // Try to extract domain name from URL
      try {
        const url = new URL(linkUrl);
        finalName = url.hostname.replace('www.', '');
      } catch {
        finalName = 'Link';
      }
    }

    onAddAttachment({
      name: finalName,
      type: 'link',
      url: linkUrl.trim(),
      uploadedBy: currentUserId
    });

    setLinkUrl('');
    setLinkName('');
    setIsAddingLink(false);
  };

  const handleDownload = (attachment: TaskAttachment) => {
    if (attachment.url) {
      window.open(attachment.url, '_blank');
    } else if (attachment.base64) {
      const link = document.createElement('a');
      link.href = attachment.base64;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePreview = (attachment: TaskAttachment) => {
    if (attachment.type === 'link' && attachment.url) {
      window.open(attachment.url, '_blank');
    } else if (attachment.type === 'image' && attachment.base64) {
      // Open image in a new tab
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${attachment.base64}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="${attachment.name}" />`);
      }
    } else {
      handleDownload(attachment);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (attachment: TaskAttachment) => {
    switch (attachment.type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'document':
        return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'link':
        return <LinkIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <File className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Paperclip className="w-5 h-5 text-brand-primary dark:text-brand-accent" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Attachments ({attachments.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Attachments */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-4 h-4" />}
              size="sm"
            >
              Upload Files
            </Button>
            <Button
              onClick={() => setIsAddingLink(true)}
              leftIcon={<LinkIcon className="w-4 h-4" />}
              size="sm"
              variant="outline"
            >
              Add Link
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept="*/*"
          />

          {/* Add Link Form */}
          {isAddingLink && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Display Name (optional)
                  </label>
                  <input
                    type="text"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    placeholder="Link description"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddLink} disabled={!linkUrl.trim()}>
                    Add Link
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingLink(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attachments List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {attachments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <Paperclip className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No attachments</p>
              <p className="text-sm">Upload files or add links to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-600">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getFileIcon(attachment)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {attachment.name}
                        </h4>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => handlePreview(attachment)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(attachment)}
                            className="p-1.5 text-slate-400 hover:text-green-600 dark:hover:text-green-400 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRemoveAttachment(attachment.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="capitalize">{attachment.type}</span>
                        {attachment.size && (
                          <>
                            <span>•</span>
                            <span>{formatFileSize(attachment.size)}</span>
                          </>
                        )}
                        {attachment.uploadedAt && (
                          <>
                            <span>•</span>
                            <span>{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      
                      {attachment.url && attachment.type === 'link' && (
                        <div className="mt-1">
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate block"
                          >
                            {attachment.url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Max file size: 10MB
          </p>
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskAttachmentsManager;