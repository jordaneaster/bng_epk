"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaShoppingBag } from "react-icons/fa";

const GRAIN_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.28'/%3E%3C/svg%3E\")";

const COLLAGE_IMAGE =
  "https://rzdoygryvifvcmhhbiaq.supabase.co/storage/v1/object/public/gallery-images/bng/merch/Cook%20the%20sound%20merch%20collection.png";

const MERCH_ITEMS = [
  {
    id: "street-chemist-tee",
    name: "Limited Run: Street Chemist Tee",
    price: 68,
    tag: "LIMITED EDITION",
    description: "This isn't just a T-shirt — it's the mindset. The Process Tee captures the raw energy behind Blenderz N Glovez. Built for those who understand the grind, the chaos, and the discipline it takes to turn nothing into something. Featuring a gritty, cinematic street-lab graphic, this piece represents focus under pressure — where every move matters and every detail counts.",
    limitedQty: 75,
    soldOut: false,
  },
  {
    id: "upper-left-tee",
    name: "BNG Blender Tee",
    price: 46,
    tag: "PRESALE",
    description: "Vintage black tee featuring the original blender crest artwork.",
    limitedQty: 15,
    soldOut: false,
  },
  {
    id: "cook-mode-hoodie",
    name: "Cook Mode Hoodie",
    price: 88,
    tag: "PRESALE",
    description: "420gsm fleece, oversized fit, distressed charcoal wash.",
    limitedQty: 8,
    soldOut: false,
  },
  {
    id: "lab-cap",
    name: "Lab Cap",
    price: 36,
    tag: "POPULAR",
    description: "Structured snapback with embroidered icon and tonal brim art.",
    limitedQty: 22,
    soldOut: false,
  },
  {
    id: "cook-sound-tee",
    name: "Cook Mode Tee",
    price: 48,
    tag: "PRESALE",
    description: "Heavyweight cotton tee with cracked storm-print artwork.",
    limitedQty: 17,
    soldOut: false,
  },
  {
    id: "crew-socks",
    name: "BNG Crew Socks",
    price: 28,
    tag: "LIMITED",
    description: "Two-pack ribbed socks with vintage wash and logo knit.",
    limitedQty: 12,
    soldOut: false,
  },
  {
    id: "cook-mode-shorts",
    name: "Cook Mode Shorts",
    price: 54,
    tag: "LIMITED",
    description: "Vintage-wash fleece shorts with vertical leg typography.",
    limitedQty: 9,
    soldOut: false,
  },
  {
    id: "bng-lab-coat",
    name: "BNG Lab Coat",
    price: 118,
    tag: "PRESALE",
    description: "Oversized lab coat with embroidered BNG crest. White-on-white tonal print, structured collar.",
    limitedQty: 6,
    soldOut: false,
  },
  {
    id: "bng-trucker-hat",
    name: "BNG Trucker Hat",
    price: 38,
    tag: "NEW",
    description: "Structured mesh-back trucker with embroidered BNG wordmark and adjustable snapback.",
    limitedQty: 20,
    soldOut: false,
  },
  {
    id: "cook-mode-bag",
    name: "Cook Mode Lab Bag",
    price: 64,
    tag: "PRESALE",
    description: "Tactical messenger bag with Cook Mode branding, adjustable strap, and patch pockets.",
    limitedQty: 10,
    soldOut: false,
  },
];

const HOTSPOTS = [
  { id: "spot-street-chemist", itemId: "street-chemist-tee", x: 45, y: 15, label: "Street Chemist Tee" },
  { id: "spot-upper-left-tee", itemId: "upper-left-tee", x: 12, y: 17, label: "Upper Tee" },
  { id: "spot-hoodie", itemId: "cook-mode-hoodie", x: 79, y: 22, label: "Hoodie" },
  { id: "spot-cap", itemId: "lab-cap", x: 62, y: 24, label: "Cap" },
  { id: "spot-tee", itemId: "cook-sound-tee", x: 26, y: 80, label: "Tee" },
  { id: "spot-socks", itemId: "crew-socks", x: 90, y: 64, label: "Socks" },
  { id: "spot-shorts", itemId: "cook-mode-shorts", x: 84, y: 47, label: "Shorts" },
  { id: "spot-lab-coat", itemId: "bng-lab-coat", x: 53, y: 60, label: "Lab Coat" },
  { id: "spot-trucker-hat", itemId: "bng-trucker-hat", x: 58, y: 38, label: "Trucker Hat" },
  { id: "spot-bag", itemId: "cook-mode-bag", x: 52, y: 84, label: "Lab Bag" },
];

function formatMoney(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getTimeLeft(targetDate) {
  const diff = Math.max(0, targetDate - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function CountdownBanner({ timeLeft }) {
  return (
    <div className="relative overflow-hidden border-b border-[#d6c8a5]/15 bg-[#0f0f0f]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: GRAIN_TEXTURE, backgroundSize: "130px 130px" }}
      />
    </div>
  );
}

function TimePill({ label, value }) {
  return (
    <span className="inline-flex min-w-[64px] items-center justify-center gap-1 rounded-full border border-[#d6c8a5]/30 bg-[#181818] px-3 py-1.5 text-[#efe6d2]">
      <span>{String(value).padStart(2, "0")}</span>
      <span className="text-[10px] opacity-70">{label}</span>
    </span>
  );
}

function HotspotOverlay({
  spot,
  item,
  isActive,
  onHover,
  onLeave,
  onSelect,
  onQueue,
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onSelect}
        onFocus={onHover}
        onBlur={onLeave}
        className={`grid h-9 w-9 place-content-center rounded-full border text-xs font-black uppercase tracking-[0.08em] transition ${
          isActive
            ? "border-[#f6e8c7] bg-[#f6e8c7] text-[#111]"
            : "border-[#f6e8c7]/70 bg-black/45 text-[#f6e8c7] hover:bg-black/65"
        }`}
        aria-label={`Select ${item.name}`}
      >
        +
      </button>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
        transition={{ duration: 0.18 }}
        className={`pointer-events-none absolute left-1/2 z-30 mt-2 hidden w-48 -translate-x-1/2 rounded-xl border border-white/20 bg-black/80 p-3 backdrop-blur md:block ${
          isActive ? "" : "hidden md:block"
        }`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d7c8a4]">{item.tag}</p>
        <p className="mt-1 text-sm font-black uppercase tracking-[0.06em] text-[#f7efdb]">{item.name}</p>
        <p className="mt-1 text-xs text-[#d7c8a4]">{formatMoney(item.price)}</p>
        <button
          type="button"
          onClick={onQueue}
          disabled={item.soldOut}
          className="pointer-events-auto mt-2 w-full rounded-lg bg-[#e2d1a8] px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#151515] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {item.soldOut ? "Sold Out" : "Enter Presale"}
        </button>
      </motion.div>
    </div>
  );
}

export default function MerchExperience() {
  const [hoveredSpotId, setHoveredSpotId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("street-chemist-tee");
  const [queueEmail, setQueueEmail] = useState("");
  const [queueStatus, setQueueStatus] = useState("");
  const [queueSubmitting, setQueueSubmitting] = useState(false);
  const [highlightQueue, setHighlightQueue] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [collageLightboxOpen, setCollageLightboxOpen] = useState(false);
  const [lbZoom, setLbZoom] = useState(1);
  const [lbOffset, setLbOffset] = useState({ x: 0, y: 0 });
  const [lbDragStart, setLbDragStart] = useState(null);
  const [dropEndsAt] = useState(() => Date.now() + 5 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(dropEndsAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(dropEndsAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [dropEndsAt]);

  useEffect(() => {
    if (!highlightQueue) return;
    const timer = setTimeout(() => setHighlightQueue(false), 4000);
    return () => clearTimeout(timer);
  }, [highlightQueue]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setLightboxOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen]);

  useEffect(() => {
    if (!collageLightboxOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setCollageLightboxOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [collageLightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen && !collageLightboxOpen) { setLbZoom(1); setLbOffset({ x: 0, y: 0 }); setLbDragStart(null); }
  }, [lightboxOpen, collageLightboxOpen]);

  const activeItemId = hoveredSpotId
    ? HOTSPOTS.find((spot) => spot.id === hoveredSpotId)?.itemId
    : selectedItemId;

  const selectedItem = useMemo(() => {
    const fallback = MERCH_ITEMS[0];
    return MERCH_ITEMS.find((item) => item.id === activeItemId) || fallback;
  }, [activeItemId]);

  const handleQueueSubmit = async (event) => {
    event.preventDefault();

    if (!selectedItem || selectedItem.soldOut) {
      setQueueStatus("This item is currently sold out.");
      return;
    }

    const email = queueEmail.trim();
    if (!email || !email.includes("@")) {
      setQueueStatus("Enter a valid email to join the queue.");
      return;
    }

    setQueueSubmitting(true);
    setQueueStatus("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email,
          preferences: { music: false, events: false, merch: true },
          source: "merch-presale-queue",
          queueItemId: selectedItem.id,
          queueItemName: selectedItem.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to join queue right now. Try again.");
      }

      setQueueEmail("");
      setQueueStatus(`You are in the presale queue for ${selectedItem.name}.`);
    } catch (error) {
      setQueueStatus(error.message || "Unable to join queue right now. Try again.");
    } finally {
      setQueueSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f7f2e8]">
      <CountdownBanner timeLeft={timeLeft} />

      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(214,200,165,0.18),transparent_42%),radial-gradient(circle_at_75%_70%,rgba(214,200,165,0.1),transparent_45%),linear-gradient(180deg,#111_0%,#0a0a0a_100%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: GRAIN_TEXTURE, backgroundSize: "160px 160px" }}
        />
        <div className="container relative z-10 py-20 sm:py-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4 text-xs uppercase tracking-[0.24em] text-[#d6c8a5]"
          >
            BNG Music Entertainment | Streetwear Division
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="max-w-4xl [font-family:var(--font-heading)] text-4xl font-black uppercase leading-[0.95] tracking-tight text-[#f8f4eb] sm:text-5xl lg:text-7xl"
          >
            WE DON&apos;T DROP MUSIC. WE COOK IT.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-4 max-w-3xl [font-family:var(--font-heading)] text-xl font-bold uppercase tracking-wide text-[#ded2b5] sm:text-2xl"
          >
            EVERYTHING THE LIGHT TOUCHES IS OURS.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="mt-8"
          >
          </motion.div>
        </div>
      </section>

      {/* FEATURED STREET CHEMIST TEE */}
      <section className="bg-[#000000] border-b border-[#d6c8a5]/15 py-16 sm:py-20">
        <div className="container px-6 sm:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:gap-16">
              <div className="flex-1 py-4">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#d6c8a5]">LIMITED EDITION | Only 75 Available</p>
                <h2 className="mb-5 [font-family:var(--font-heading)] text-3xl font-black uppercase leading-tight tracking-tight text-[#f8f4eb] sm:text-4xl">
                  Limited Run:<br />Street Chemist Tee
                </h2>
                <p className="mb-7 text-sm leading-relaxed text-[#d6c8a5] max-w-md">
                  This isn&apos;t just a T-shirt — it&apos;s the mindset. The Process Tee captures the raw energy behind Blenderz N Glovez. Built for those who understand the grind, the chaos, and the discipline it takes to turn nothing into something.
                </p>
                <div className="flex gap-6 flex-wrap mb-7">
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-[#d6c8a5] mb-1">Price</p>
                    <p className="text-2xl font-black text-[#f8f4eb]">$68</p>
                  </div>
                  <div className="h-12 w-px bg-[#d6c8a5]/20" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-[#d6c8a5] mb-1">Stock</p>
                    <p className="text-2xl font-black text-[#f8f4eb]">75 Units</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedItemId("street-chemist-tee");
                    setHighlightQueue(true);
                    const formEl = document.getElementById('presale-queue-form');
                    formEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e2d1a8] px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#151515] transition hover:bg-[#efe0bb]"
                >
                  Enter Presale Queue
                </button>
              </div>
              <div
                className="flex-1 relative rounded-xl border border-[#d6c8a5]/15 overflow-hidden group cursor-zoom-in"
                style={{ minHeight: '480px', background: '#000000' }}
                onClick={() => setLightboxOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Zoom in to inspect the Street Chemist Tee"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true); }}
              >
                <Image
                  src="https://rzdoygryvifvcmhhbiaq.supabase.co/storage/v1/object/public/gallery-images/bng/merch/Urban%20style%20with%20edgy%20design.png"
                  alt="Limited Run: Street Chemist Tee"
                  fill
                  style={{ objectFit: 'contain', padding: '1.5rem', filter: 'brightness(0.78) contrast(1.05)' }}
                  sizes="(max-width: 768px) 100vw, 550px"
                />
                {/* Vignette overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.75) 100%)', pointerEvents: 'none', zIndex: 1 }} />
                {/* Zoom hint badge */}
                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#d6c8a5] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  Inspect
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collage-presale" className="container py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-[1500px] gap-6 lg:grid-cols-[2.2fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-[#131313] p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#d6c8a5]">
              Hover or tap the collage to select an item for presale
            </p>

            <div className="relative overflow-hidden rounded-xl border border-white/10 p-2 sm:p-3">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 opacity-[0.08]"
                style={{ backgroundImage: GRAIN_TEXTURE, backgroundSize: "120px 120px" }}
              />

              <div
                className="group relative mx-auto aspect-[2/3] w-full max-w-[760px] cursor-zoom-in bg-[#0e0e0e]"
                onClick={() => setCollageLightboxOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Zoom in to inspect the full merch collage"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCollageLightboxOpen(true); }}
              >
                <Image
                  src={COLLAGE_IMAGE}
                  alt="BNG merch interactive collage"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 760px"
                  className="object-contain"
                  priority
                />
                {/* Zoom hint badge */}
                <div className="pointer-events-none absolute bottom-3 right-3 z-30 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#d6c8a5] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  Inspect
                </div>

                {HOTSPOTS.map((spot) => {
                  const item = MERCH_ITEMS.find((entry) => entry.id === spot.itemId);
                  if (!item) return null;
                  const isActive = hoveredSpotId === spot.id;

                  return (
                    <HotspotOverlay
                      key={spot.id}
                      spot={spot}
                      item={item}
                      isActive={isActive}
                      onHover={() => setHoveredSpotId(spot.id)}
                      onLeave={() => setHoveredSpotId("")}
                      onSelect={() => {
                        setSelectedItemId(spot.itemId);
                        setQueueStatus("");
                      }}
                      onQueue={() => {
                        setSelectedItemId(spot.itemId);
                        setQueueStatus(`Selected ${item.name}. Enter your email below.`);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:hidden">
              {HOTSPOTS.map((spot) => {
                const item = MERCH_ITEMS.find((entry) => entry.id === spot.itemId);
                if (!item) return null;
                const isCurrent = selectedItemId === item.id;

                return (
                  <button
                    key={`mobile-${spot.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setHoveredSpotId(spot.id);
                      setQueueStatus("");
                    }}
                    style={{ padding: "16px 20px" }}
                    className={`flex min-h-[80px] flex-col justify-center gap-2 rounded-xl border text-left transition ${
                      isCurrent
                        ? "border-[#d6c8a5] bg-[#d6c8a5]/15 text-[#f7ecd2]"
                        : "border-white/10 bg-black/20 text-[#d8c8a2]"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-80">{item.tag}</p>
                    <p className="text-xs font-black uppercase tracking-[0.08em] leading-snug">{spot.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <aside id="presale-queue-form" className={`rounded-2xl border bg-[#121212] p-6 sm:p-7 transition-all duration-700 ${highlightQueue ? 'border-[#e2d1a8] shadow-[0_0_0_3px_rgba(226,209,168,0.25),0_0_40px_rgba(226,209,168,0.12)]' : 'border-[#d6c8a5]/25'}`}>
            {highlightQueue && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#e2d1a8]/40 bg-[#e2d1a8]/10 px-4 py-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#e2d1a8] text-[10px] font-black text-[#151515]">✓</span>
                <p className="text-xs font-bold text-[#f2e8d2]">Street Chemist Tee selected — enter your email below to lock in your spot.</p>
              </div>
            )}
            <div className="rounded-xl border border-white/10 bg-[#161616] p-4 sm:p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#d6c8a5]">Presale Queue</p>
              <h2 className="mt-3 [font-family:var(--font-heading)] text-2xl font-black uppercase tracking-tight text-[#f8f2e5] sm:text-[2rem]">
                {selectedItem.name}
              </h2>
              <p className="mt-2 text-sm text-[#d6c8a5]">{formatMoney(selectedItem.price)} | {selectedItem.tag}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{selectedItem.description}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.13em] text-[#efe6d2]">
                Limited quantity: {selectedItem.limitedQty}
              </p>
            </div>

            <form onSubmit={handleQueueSubmit} className="mt-5 space-y-3 rounded-xl border border-white/10 bg-[#161616] p-4 sm:p-5">
              <input
                type="email"
                value={queueEmail}
                onChange={(event) => setQueueEmail(event.target.value)}
                placeholder="Enter email for presale queue"
                style={{ padding: "16px 20px", borderRadius: "10px" }}
                className="min-h-[56px] w-full border border-white/15 bg-[#1b1b1b] text-sm text-[#f6f1e5] outline-none ring-[#d6c8a5]/50 placeholder:text-white/40 focus:ring-2"
                required
              />
              <button
                type="submit"
                disabled={queueSubmitting || selectedItem.soldOut}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#e2d1a8] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#151515] transition hover:bg-[#efe0bb] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {selectedItem.soldOut
                  ? "Sold Out"
                  : queueSubmitting
                    ? "Joining Queue..."
                    : "Enter Presale Queue"}
              </button>
            </form>

            {queueStatus && <p className="mt-4 rounded-lg border border-[#d6c8a5]/20 bg-[#1a1a1a] px-4 py-3 text-sm leading-relaxed text-[#f2e8d2]">{queueStatus}</p>}

            <div className="mt-6 rounded-xl border border-white/10 bg-[#171717] p-5 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[#d6c8a5]">Need support?</p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#d6c8a5]/35 px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-[#efe6d2] transition hover:bg-[#1f1f1f]"
              >
                <FaShoppingBag />
                Contact BNG Team
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* COLLAGE LIGHTBOX MODAL */}
      {collageLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex select-none items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => { if (!lbDragStart) setCollageLightboxOpen(false); }}
          onWheel={(e) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 0.3 : -0.3;
            setLbZoom(prev => {
              const next = Math.max(1, Math.min(8, prev + factor));
              if (next <= 1) setLbOffset({ x: 0, y: 0 });
              return next;
            });
          }}
        >
          <button
            type="button"
            onClick={() => setCollageLightboxOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          {lbZoom > 1 && (
            <div className="absolute left-4 top-4 z-20 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-wider text-white/60">
              {Math.round(lbZoom * 100)}%
            </div>
          )}
          <div
            className="overflow-hidden"
            style={{
              width: 'min(92vw, 700px)',
              height: 'min(92vh, 1050px)',
              cursor: lbZoom > 1 ? (lbDragStart ? 'grabbing' : 'grab') : 'zoom-in',
            }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={() => {
              if (lbZoom > 1) { setLbZoom(1); setLbOffset({ x: 0, y: 0 }); }
              else setLbZoom(3);
            }}
            onMouseDown={(e) => {
              if (lbZoom > 1) { e.preventDefault(); setLbDragStart({ x: e.clientX - lbOffset.x, y: e.clientY - lbOffset.y }); }
            }}
            onMouseMove={(e) => {
              if (lbDragStart) setLbOffset({ x: e.clientX - lbDragStart.x, y: e.clientY - lbDragStart.y });
            }}
            onMouseUp={() => setLbDragStart(null)}
            onMouseLeave={() => setLbDragStart(null)}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transform: `translate(${lbOffset.x}px, ${lbOffset.y}px) scale(${lbZoom})`,
              transformOrigin: 'center',
              transition: lbDragStart ? 'none' : 'transform 0.15s ease',
            }}>
              <Image
                src={COLLAGE_IMAGE}
                alt="BNG merch collage — full view"
                fill
                style={{ objectFit: 'contain' }}
                sizes="min(92vw, 700px)"
                priority
              />
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLbZoom(prev => { const n = Math.max(1, +(prev - 0.5).toFixed(1)); if (n <= 1) setLbOffset({ x: 0, y: 0 }); return n; }); }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
              aria-label="Zoom out"
            >−</button>
            <span className="min-w-[4rem] text-center text-[11px] font-bold uppercase tracking-widest text-white/50">
              {Math.round(lbZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLbZoom(prev => +(Math.min(8, prev + 0.5)).toFixed(1)); }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
              aria-label="Zoom in"
            >+</button>
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] text-white/25">
            Scroll or +/− to zoom &middot; Double-click to toggle &middot; Drag to pan &middot; Esc to close
          </p>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex select-none items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => { if (!lbDragStart) setLightboxOpen(false); }}
          onWheel={(e) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 0.3 : -0.3;
            setLbZoom(prev => {
              const next = Math.max(1, Math.min(8, prev + factor));
              if (next <= 1) setLbOffset({ x: 0, y: 0 });
              return next;
            });
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          {lbZoom > 1 && (
            <div className="absolute left-4 top-4 z-20 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-wider text-white/60">
              {Math.round(lbZoom * 100)}%
            </div>
          )}
          <div
            className="overflow-hidden"
            style={{
              width: 'min(90vw, 820px)',
              height: 'min(88vh, 820px)',
              cursor: lbZoom > 1 ? (lbDragStart ? 'grabbing' : 'grab') : 'zoom-in',
            }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={() => {
              if (lbZoom > 1) { setLbZoom(1); setLbOffset({ x: 0, y: 0 }); }
              else setLbZoom(3);
            }}
            onMouseDown={(e) => {
              if (lbZoom > 1) { e.preventDefault(); setLbDragStart({ x: e.clientX - lbOffset.x, y: e.clientY - lbOffset.y }); }
            }}
            onMouseMove={(e) => {
              if (lbDragStart) setLbOffset({ x: e.clientX - lbDragStart.x, y: e.clientY - lbDragStart.y });
            }}
            onMouseUp={() => setLbDragStart(null)}
            onMouseLeave={() => setLbDragStart(null)}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transform: `translate(${lbOffset.x}px, ${lbOffset.y}px) scale(${lbZoom})`,
              transformOrigin: 'center',
              transition: lbDragStart ? 'none' : 'transform 0.15s ease',
            }}>
              <Image
                src="https://rzdoygryvifvcmhhbiaq.supabase.co/storage/v1/object/public/gallery-images/bng/merch/Urban%20style%20with%20edgy%20design.png"
                alt="Limited Run: Street Chemist Tee — full view"
                fill
                style={{ objectFit: 'contain' }}
                sizes="min(90vw, 820px)"
                priority
              />
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLbZoom(prev => { const n = Math.max(1, +(prev - 0.5).toFixed(1)); if (n <= 1) setLbOffset({ x: 0, y: 0 }); return n; }); }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
              aria-label="Zoom out"
            >−</button>
            <span className="min-w-[4rem] text-center text-[11px] font-bold uppercase tracking-widest text-white/50">
              {Math.round(lbZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLbZoom(prev => +(Math.min(8, prev + 0.5)).toFixed(1)); }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl text-white transition hover:bg-white/20"
              aria-label="Zoom in"
            >+</button>
          </div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] text-white/25">
            Scroll or +/− to zoom &middot; Double-click to toggle &middot; Drag to pan &middot; Esc to close
          </p>
        </div>
      )}
    </div>
  );
}
