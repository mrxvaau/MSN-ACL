import Image from "next/image";

interface PageBannerProps {
  title: string;
  subtitle?: string | null;
  backgroundImage?: string | null;
}

export default function PageBanner({ title, subtitle, backgroundImage }: PageBannerProps) {
  return (
    <section className="pt-32 pb-20 bg-zinc-950 text-white overflow-hidden relative">
      {/* Background */}
      {backgroundImage ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-950/90 z-0"></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-zinc-950/80 z-0"></div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
        {subtitle && (
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
