import Modal from "./Modal";

export default function ViewDocumentModal({
  open,
  onClose,
  title = "Identity Document",
  filename,
  imageUrl,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-lg">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-xs rounded-xl overflow-hidden bg-gray-100 aspect-3/4 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={filename}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-400">No preview available</span>
          )}
        </div>
        {filename && <p className="mt-3 text-sm text-gray-500">{filename}</p>}
      </div>
    </Modal>
  );
}
