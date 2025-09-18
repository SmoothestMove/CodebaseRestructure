import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(price);
};

export function constructMetadata({
  title = "Smooth Moves Waitlist",
  description = "Join the Smooth Moves beta to plan, track, and automate every move with QR labels, budgeting, and the MARVIN AI assistant.",
  image = "/openGraph.png",
  icons = "/favicon.ico",
  url = "https://smooth-moves-waitlist.example/",
  twitterHandle = "@smoothmovesapp",
  siteName = "Smooth Moves Waitlist",
} = {}) {
  return {
    title,
    description,
    icons,
    openGraph: {
      title,
      description,
      siteName,
      url,
      type: "website",
      images: [{ url: image }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: twitterHandle,
    },
    metadataBase: new URL(url)
  };
}

