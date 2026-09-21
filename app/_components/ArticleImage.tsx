import Image from "next/image";
import type { PublishedArticleImage } from "../_seo/articleImages";

export default function ArticleImage({ image, priority = false }: { image: PublishedArticleImage; priority?: boolean }) {
  return (
    <figure className="my-9 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
      <Image
        src={image.sourcePath}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(max-width: 768px) calc(100vw - 2.5rem), 768px"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="h-auto w-full"
      />
      <figcaption className="border-t border-neutral-200 px-5 py-3 text-sm leading-6 text-neutral-600">
        {image.heading}
      </figcaption>
    </figure>
  );
}
