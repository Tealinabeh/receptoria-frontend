export function OptimizedPicture({
  src,
  alt,
  className,
  isLcp = false,
  fallbackImage = "./fallback-preview.jpeg"
}) {

  if (!src) {
    return <img src={fallbackImage} alt={alt || "Зображення недоступне"} className={className} />;
  }

  return (
    <>
      {isLcp && (
        <link rel="preload" as="image" href={src} />
      )}

      <img
        src={src}
        alt={alt}
        className={className}
        loading={isLcp ? "eager" : "lazy"}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallbackImage;
        }}
      />
    </>
  );
}
