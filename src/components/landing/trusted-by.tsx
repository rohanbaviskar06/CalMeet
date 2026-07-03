"use client";

import { motion } from "framer-motion";

const companies = [
  {
    name: "Stripe",
    logo: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 256 256">
        <path fill="#635BFF" fillRule="evenodd" d="M119.525 103.736C119.525 98.5934 123.73 96.6154 130.694 96.6154C140.68 96.6154 153.294 99.6483 163.28 105.055V74.0659C152.374 69.7143 141.6 68 130.694 68C104.02 68 86.2812 81.978 86.2812 105.319C86.2812 141.714 136.212 135.912 136.212 151.604C136.212 157.67 130.956 159.648 123.598 159.648C112.692 159.648 98.764 155.165 87.7266 149.099V180.484C99.9466 185.758 112.298 188 123.598 188C150.929 188 169.719 174.418 169.719 150.813C169.587 111.516 119.525 118.505 119.525 103.736Z" clipRule="evenodd"></path>
      </svg>
    )
  },
  {
    name: "Notion",
    logo: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 256 256">
        <path fill="currentColor" d="M145.561 64.9543L75.6115 70.1202C69.9697 70.6094 68.0059 74.2965 68.0059 78.7166V155.4C68.0059 158.842 69.2276 161.788 72.1774 165.723L88.6199 187.104C91.321 190.547 93.7773 191.284 98.9352 191.04L180.164 186.122C187.033 185.633 189.001 182.435 189.001 177.029V90.7598C189.001 87.9661 187.897 87.1612 184.648 84.7762L184.088 84.3717L161.763 68.6414C156.361 64.7142 154.153 64.217 145.561 64.9543ZM100.772 89.3481C94.1398 89.7947 92.6354 89.8958 88.8685 86.8322L79.2905 79.2138C78.3169 78.2279 78.8056 76.9971 81.2581 76.7528L148.502 71.8397C154.149 71.3467 157.09 73.3143 159.298 75.0338L170.831 83.39C171.324 83.6381 172.55 85.109 171.075 85.109L101.632 89.289L100.772 89.3481ZM93.04 176.291V103.055C93.04 99.8571 94.0217 98.3825 96.9629 98.1339L176.722 93.4647C179.427 93.2204 180.649 94.9393 180.649 98.1339V170.881C180.649 174.079 180.156 176.784 175.74 177.029L99.4154 181.453C94.9996 181.698 93.04 180.227 93.04 176.291ZM168.383 106.982C168.872 109.195 168.383 111.407 166.171 111.66L162.492 112.389V166.46C159.298 168.179 156.357 169.161 153.9 169.161C149.973 169.161 148.991 167.931 146.05 164.248L121.993 126.399V163.017L129.603 164.741C129.603 164.741 129.603 169.166 123.464 169.166L106.537 170.147C106.044 169.161 106.537 166.705 108.252 166.216L112.672 164.989V116.573L106.537 116.076C106.044 113.864 107.27 110.67 110.709 110.421L128.87 109.199L153.9 147.536V113.62L147.52 112.886C147.027 110.177 148.991 108.209 151.443 107.969L168.383 106.982Z"></path>
      </svg>
    )
  },
  {
    name: "Linear",
    logo: (
      <svg className="w-5 h-5 text-zinc-900 dark:text-zinc-100" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"></path>
      </svg>
    )
  },
  {
    name: "Vercel",
    logo: (
      <svg className="w-5 h-5 text-zinc-900 dark:text-zinc-100" fill="currentColor" viewBox="0 0 256 222">
        <path d="m128 0 128 221.705H0z"></path>
      </svg>
    )
  },
  {
    name: "Figma",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#0ACF83" d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z"></path>
        <path fill="#A259FF" d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z"></path>
        <path fill="#F24E1E" d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z"></path>
        <path fill="#FF7262" d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z"></path>
        <path fill="#1ABCFE" d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z"></path>
      </svg>
    )
  },
  {
    name: "Loom",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 256 256">
        <path fill="#625DF5" d="M256 113.765h-74.858l64.83-37.43-14.237-24.667-64.83 37.43 37.421-64.825-24.667-14.246-37.421 64.826V0h-28.476v74.86L76.326 10.027 51.667 24.266 89.096 89.09 24.265 51.668l-14.238 24.66 64.83 37.43H0v28.477h74.85l-64.823 37.43 14.238 24.667 64.824-37.423-37.43 64.825 24.667 14.239 37.429-64.832V256h28.476v-74.853l37.422 64.826 24.665-14.239-37.428-64.832 64.83 37.43 14.24-24.667-64.825-37.423h74.85v-28.477H256ZM128 166.73c-21.472 0-38.876-17.403-38.876-38.876 0-21.472 17.404-38.876 38.876-38.876 21.472 0 38.875 17.404 38.875 38.876 0 21.473-17.403 38.876-38.875 38.876Z"></path>
      </svg>
    )
  },
  {
    name: "Atlassian",
    logo: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 48 48">
        <path fill="#2681FF" d="M0 24C0 10.745 10.745 0 24 0s24 10.745 24 24-10.745 24-24 24S0 37.255 0 24Z" opacity="0.1"></path>
        <path fill="url(#atlassian-grad)" d="M19.092 20.636c-.358-.382-.915-.36-1.157.126l-5.861 11.721a.7.7 0 0 0 .627 1.014h8.161a.676.676 0 0 0 .627-.387c1.76-3.639.694-9.171-2.397-12.474Z"></path>
        <path fill="#2681FF" d="M23.392 9.975c-3.278 5.194-3.062 10.946-.903 15.264l3.936 7.871a.7.7 0 0 0 .626.387h8.162a.7.7 0 0 0 .627-1.014S24.86 10.521 24.583 9.971c-.246-.492-.874-.499-1.191.004Z"></path>
        <defs>
          <linearGradient id="atlassian-grad" x1="18.085" x2="9.869" y1="18.517" y2="27.343" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0052CC"></stop>
            <stop offset=".923" stopColor="#2684FF"></stop>
          </linearGradient>
        </defs>
      </svg>
    )
  }
];

// Duplicate for seamless marquee loop
const doubled = [...companies, ...companies];

export function TrustedBy() {
  return (
    <section className="py-14 border-y bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Trusted by teams at world-class companies
        </p>
      </div>

      {/* Marquee */}
      <div className="relative w-full flex overflow-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <motion.div
          className="flex gap-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 30,
          }}
        >
          {doubled.map((company, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl border bg-card flex-shrink-0 hover:shadow-sm transition-shadow"
            >
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {company.logo}
              </div>
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                {company.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
