export async function generateEPK(
  artistData,
  musicData,
  videoData,
  pressData,
  imageUrls,
  options = {}
) {
  return new Promise(async (resolve) => {
    const { jsPDF } = await import('jspdf');

    // Theme configuration
    const theme = {
      background: '#000000',
      surface: '#111111',
      accent: '#FFD700', // Yellow/Gold
      textMain: '#FFFFFF',
      textSec: '#AAAAAA',
      ...options.theme,
    };

    const hexToRgb = (hex) => {
      const clean = hex.replace('#', '');
      const bigint = parseInt(clean, 16);
      return [
        (bigint >> 16) & 255,
        (bigint >> 8) & 255,
        bigint & 255,
      ];
    };

    const colors = {
      bg: hexToRgb(theme.background),
      surface: hexToRgb(theme.surface),
      accent: hexToRgb(theme.accent),
      text: hexToRgb(theme.textMain),
      textSec: hexToRgb(theme.textSec),
    };

    const ensureAbsoluteUrl = (url) => {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      const base = options.baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
      return base ? `${base}${url}` : url;
    };

    // Prepare images
    const combinedImages = [
      ...(options.customPhotos || []),
      ...(imageUrls || []),
    ]
      .map((url) => ensureAbsoluteUrl(url))
      .filter(Boolean);
    const uniqueImages = Array.from(new Set(combinedImages));

    const loadImage = (url) =>
      new Promise((resolve) => {
        if (!url) return resolve(null);
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      });

    const drawImageContainedRotated = async (
      url,
      x,
      curY,
      w,
      h,
      rotationDeg = 90,
      flipX = false,
      flipY = false
    ) => {
      const img = await loadImage(url);
      if (!img || typeof document === 'undefined') return;

      const isRightAngle = Math.abs(rotationDeg % 180) === 90;
      const canvas = document.createElement('canvas');
      canvas.width = isRightAngle ? img.height : img.width;
      canvas.height = isRightAngle ? img.width : img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotationDeg * Math.PI) / 180);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const ratio = canvas.width / canvas.height;
      const targetRatio = w / h;

      let drawW, drawH;
      if (ratio > targetRatio) {
        drawW = w;
        drawH = w / ratio;
      } else {
        drawH = h;
        drawW = h * ratio;
      }

      const offsetX = x + (w - drawW) / 2;
      const offsetY = curY + (h - drawH) / 2;
      doc.addImage(dataUrl, 'JPEG', offsetX, offsetY, drawW, drawH);
    };

    // Initialize PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin; // Vertical cursor

    // --- Helpers ---

    const drawBlock = (h, color = colors.surface) => {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(margin, y, contentWidth, h, 2, 2, 'F');
    };

    const addText = (text, x, curY, size, color, font = 'bold', align = 'left') => {
      doc.setFont('helvetica', font);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(text, x, curY, { align });
    };

    const addWrappedText = (text, x, curY, w, size, color, lineHeight = 5) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, w);
      lines.forEach((line, i) => {
        doc.text(line, x, curY + (i * lineHeight));
      });
      return curY + (lines.length * lineHeight);
    };

    // Draws image contained within rect (preserving aspect ratio, no crop)
    const drawImageContained = async (url, x, curY, w, h) => {
      const img = await loadImage(url);
      if (!img) return;
      const ratio = img.width / img.height;
      const targetRatio = w / h;
      
      let drawW, drawH;
      if (ratio > targetRatio) {
        drawW = w;
        drawH = w / ratio;
      } else {
        drawH = h;
        drawW = h * ratio;
      }
      
      const offsetX = x + (w - drawW) / 2;
      const offsetY = curY + (h - drawH) / 2;
      doc.addImage(img, 'JPEG', offsetX, offsetY, drawW, drawH);
    };

    // --- Background ---
    doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // ================= PAGE 1 =================

    // --- 1. Header (Artist Name) ---
    y += 5; // Top padding
    addText(artistData.name || 'Artist Name', pageWidth / 2, y + 10, 32, colors.accent, 'bold', 'center');
    y += 22;
    addText(artistData.tagline || 'Performer | Artist', pageWidth / 2, y, 14, colors.text, 'normal', 'center');
    y += 25;

    // --- 2. Large Hero Image Only ---
    const heroHeight = 160;
    const heroImgUrl = uniqueImages[0] || (options.customPhotos && options.customPhotos[0]) || ensureAbsoluteUrl('/images/hero-bg.jpg');
    const heroWidth = contentWidth * 0.9;
    const heroX = margin + (contentWidth - heroWidth) / 2;
    
    await drawImageContained(heroImgUrl, heroX, y, heroWidth, heroHeight);
    
    // Add page number
    doc.setFontSize(9);
    doc.setTextColor(colors.textSec[0], colors.textSec[1], colors.textSec[2]);
    doc.text("1 / 4", pageWidth - margin, pageHeight - margin, { align: 'right' });


    // ================= PAGE 2 - BIOGRAPHY =================
    doc.addPage();
    doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    y = margin + 10;

    // Biography Content
    addText('BIOGRAPHY', margin, y, 14, colors.accent);
    y += 8;
    
    // Strip HTML and special chars including emojis (which break jsPDF rendering)
    const rawBio = (artistData.longBio || artistData.bio || '');
    const bioText = rawBio
      .replace(/<[^>]*>?/gm, '') 
      .replace(/[^\x20-\x7E\n\r\t.,'"]/g, '')
      .trim() || 'Biography content goes here.';

    // Split bio by paragraphs (newline characters) and render each with spacing
    const paragraphs = bioText.split(/\n+/).filter(p => p.trim());
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(colors.textSec[0], colors.textSec[1], colors.textSec[2]);
    
    const lineHeight = 5.5;
    const paragraphSpacing = 8;
    
    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i].trim();
      const lines = doc.splitTextToSize(para, contentWidth);
      
      // Render paragraph
      lines.forEach((line, j) => {
        doc.text(line, margin, y + (j * lineHeight));
      });
      
      y += lines.length * lineHeight;
      
      // Add spacing between paragraphs
      if (i < paragraphs.length - 1) {
        y += paragraphSpacing;
      }
    }

    // Add rel.jpeg photo below bio to fill space
    y += 15;
    const bioPhotoHeight = Math.min(pageHeight - y - margin - 20, 90);
    const bioPhotoUrl = ensureAbsoluteUrl('/images/rel.jpeg');
    if (bioPhotoUrl && bioPhotoHeight > 30) {
      await drawImageContained(bioPhotoUrl, margin, y, contentWidth, bioPhotoHeight);
    }
    
    // Page number
    doc.setFontSize(9);
    doc.setTextColor(colors.textSec[0], colors.textSec[1], colors.textSec[2]);
    doc.text("2 / 4", pageWidth - margin, pageHeight - margin, { align: 'right' });


    // ================= PAGE 3 - MUSIC =================
      
      y += lines.length * lineHeight;
      
      // Add spacing between paragraphs (but not after the last one)
      if (i < paragraphs.length - 1) {
        y += paragraphSpacing;
      }
    }

    // BNG Callout Box (only on page 1)
    y += 10;
    const calloutText = "BNG Nappsakk’s work aligns with CHRÉE CEE AF’s mission of celebrating Black artistry, cultural innovation, and community-driven creative expression.";
    
    // Calculate space needed
    const calloutLines = doc.splitTextToSize(calloutText, contentWidth - 10);
    const calloutH = (calloutLines.length * 5.5) + 12; // padding
    
    // Draw box
    doc.setLineWidth(0.5);
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setFillColor(colors.surface[0], colors.surface[1], colors.surface[2]);
    doc.roundedRect(margin, y, contentWidth, calloutH, 2, 2, 'FD');
    
    // Draw text
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(calloutLines, margin + 5, y + 8);
    
    y += calloutH;
    
    // Add page number
    doc.setFontSize(9);
    doc.setTextColor(colors.textSec[0], colors.textSec[1], colors.textSec[2]);
    doc.text("1 / 3", pageWidth - margin, pageHeight - margin, { align: 'right' });


    // ================= PAGE 3 - MUSIC =================
    doc.addPage();
    doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    y = margin + 10;

    // --- 3. Music Section ---
    addText('LATEST RELEASES', margin, y, 16, colors.accent);
    y += 12;

    const releases = musicData.slice(0, 3); // Top 3
    const trackWidth = (contentWidth - (15 * 2)) / 3; // 3 items
    
    for (let i = 0; i < releases.length; i++) {
        const track = releases[i];
        const tx = margin + (i * (trackWidth + 15));
        
        // Artwork - bigger on page 2
        const artUrl = ensureAbsoluteUrl(track.cover_url || track.coverArt || track.image_url);
        doc.setFillColor(colors.surface[0], colors.surface[1], colors.surface[2]);
        doc.roundedRect(tx, y, trackWidth, trackWidth, 1, 1, 'F');
        
        if (artUrl) {
           await drawImageContained(artUrl, tx, y, trackWidth, trackWidth);
        }
        
        // Metadata below
        const metaY = y + trackWidth + 6;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        const cleanTitle = (track.title || "Untitled").substring(0, 25);
        doc.text(cleanTitle, tx, metaY);

        // Listen Button/Link
        const linkY = metaY + 6;
        if (track.spotify_link || track.url) {
            doc.setFontSize(10);
            doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            
            // Draw small "Play" triangle manually
            doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.triangle(
                tx, linkY,          // top-left
                tx, linkY + 4,      // bottom-left
                tx + 3.5, linkY + 2, // point
                'F'
            );
            
            doc.text("Listen Now", tx + 5, linkY + 3);
            doc.link(tx, linkY - 2, 30, 6, { url: track.spotify_link || track.url });
        }
    }
    y += trackWidth + 40; // Increased padding before festivals

    // --- Festival & Showcase Highlights ---
    addText('FESTIVAL & SHOWCASE HIGHLIGHTS', margin, y, 14, colors.accent);
    y += 8;

    const festivals = [
        "SXSW (Austin, TX) Live - 3/13/26",
        "Kreate 510 Live - 3/14/26",
        "New Energy Live Stage - 3/15/26",
        "Rep Your State Stage",
        "DMG Worldwide Showcases",
        "Big Heffs Streets Most Wanted Tour"
    ];

    doc.setFontSize(10);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "normal");

    // 2-Column List
    const halfLen = Math.ceil(festivals.length / 2);
    const leftCol = festivals.slice(0, halfLen);
    const rightCol = festivals.slice(halfLen);

    leftCol.forEach((fest, i) => {
        doc.text(`• ${fest}`, margin + 5, y + (i * 6));
    });
    rightCol.forEach((fest, i) => {
        doc.text(`• ${fest}`, margin + (contentWidth / 2) + 5, y + (i * 6));
    });

    y += (halfLen * 6) + 12; // Slight padding before image

    // --- Page 2 Highlight Images (Side-by-Side) ---
    if (options.page2Images && options.page2Images.length > 0) {
      const availableH = (pageHeight - margin - 15) - y;
      const targetH = Math.min(Math.max(availableH, 0), 85);
      if (targetH > 20) {
        const gap = 6;
        const totalW = contentWidth - gap;
        const rawRatios = options.page2ImageWidths && options.page2ImageWidths.length === 2
          ? options.page2ImageWidths
          : [0.45, 0.55];
        const ratioSum = rawRatios[0] + rawRatios[1];
        const leftW = totalW * (rawRatios[0] / ratioSum);
        const rightW = totalW * (rawRatios[1] / ratioSum);

        const leftImg = ensureAbsoluteUrl(options.page2Images[0]);
        const rightImg = ensureAbsoluteUrl(options.page2Images[1] || options.page2Images[0]);
            const leftRot = (options.page2ImageRotations && options.page2ImageRotations[0]) || 0;
            const rightRot = (options.page2ImageRotations && options.page2ImageRotations[1]) || 0;
            const leftFlipX = (options.page2ImageFlips && options.page2ImageFlips[0] && options.page2ImageFlips[0].x) || false;
            const leftFlipY = (options.page2ImageFlips && options.page2ImageFlips[0] && options.page2ImageFlips[0].y) || false;
            const rightFlipX = (options.page2ImageFlips && options.page2ImageFlips[1] && options.page2ImageFlips[1].x) || false;
            const rightFlipY = (options.page2ImageFlips && options.page2ImageFlips[1] && options.page2ImageFlips[1].y) || false;

        if (leftRot || leftFlipX || leftFlipY) {
          await drawImageContainedRotated(leftImg, margin, y, leftW, targetH, leftRot, leftFlipX, leftFlipY);
        } else {
          await drawImageContained(leftImg, margin, y, leftW, targetH);
        }

        if (rightRot || rightFlipX || rightFlipY) {
          await drawImageContainedRotated(rightImg, margin + leftW + gap, y, rightW, targetH, rightRot, rightFlipX, rightFlipY);
        } else {
          await drawImageContained(rightImg, margin + leftW + gap, y, rightW, targetH);
        }

        y += targetH + 10;
      }
    }

    // Page 3 Footer Number
    doc.setFontSize(9);
    doc.setTextColor(colors.textSec[0], colors.textSec[1], colors.textSec[2]);
    doc.text("3 / 4", pageWidth - margin, pageHeight - margin, { align: 'right' });

    // ================= PAGE 4 - VIDEOS & GALLERY =================
    doc.addPage();
    doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    y = margin + 10;

    // --- 4. Videos Section (Explicit Links) ---
    addText('VIDEOS', margin, y, 16, colors.accent);
    y += 10;
    
    // List layout for videos
    const videoItems = videoData.slice(0, 3); 
    
    for (let i = 0; i < videoItems.length; i++) {
        const vid = videoItems[i];
        // Draw container
        const rowH = 25;
        doc.setDrawColor(colors.surface[0], colors.surface[1], colors.surface[2]);
        doc.setFillColor(colors.surface[0], colors.surface[1], colors.surface[2]);
        doc.roundedRect(margin, y, contentWidth, rowH, 1, 1, 'F');
        
        // Icon / play button placeholder
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        // Draw triangle manually for "Play" icon
        doc.triangle(
            margin + 8, y + 8,     // top-left
            margin + 8, y + 18,    // bottom-left
            margin + 16, y + 13,   // point
            'F'
        );
        
        // Title
        doc.setFont("helvetica", "bold");
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.setFontSize(11);
        doc.text((vid.title || "Official Video").substring(0, 50), margin + 25, y + 9);
        
        // Subtext / Platform
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colors.textSec[0], colors.textSec[1], colors.textSec[2]);
        doc.setFontSize(9);
        const platform = vid.platform || 'YouTube';
        // Construct link - Handle case where video_id is already a full URL
        let vidLink = vid.url || 'https://youtube.com';
        
        if (vid.video_id) {
            if (vid.video_id.startsWith('http')) {
                vidLink = vid.video_id;
            } else {
                vidLink = vid.platform === 'vimeo' 
                  ? `https://vimeo.com/${vid.video_id}` 
                  : `https://youtube.com/watch?v=${vid.video_id}`;
            }
        }
          
        doc.text(`Watch on ${platform}`, margin + 25, y + 18);
        
        // Whole row link
        doc.link(margin, y, contentWidth, rowH, { url: vidLink });
        
        y += rowH + 6; // Reduced
    }
    
    y += 10;

    // --- 5. Gallery Grid & Footer ---
    
    addText('GALLERY', margin, y, 16, colors.accent);
    // Link to full gallery
    if (options.photosPageUrl) {
         doc.setFontSize(10);
         doc.text("View All >", margin + 40, y); 
         doc.link(margin + 40, y - 4, 30, 6, { url: options.photosPageUrl });
    }
    y += 6; // Reduced

    const galleryImage = options.galleryImage
      ? ensureAbsoluteUrl(options.galleryImage)
      : (uniqueImages[1] || uniqueImages[0]);
    const highlightImage = options.page3Image
      ? ensureAbsoluteUrl(options.page3Image)
      : null;
    const page3Rotations = options.page3ImageRotations || [0, 0];

    const galH = 70;
    const gap = 6;
    if (galleryImage && highlightImage) {
      const imageW = (contentWidth - gap) / 2;
      const leftRot = page3Rotations[0] || 0;
      const rightRot = page3Rotations[1] || 0;

      if (leftRot) {
        await drawImageContainedRotated(galleryImage, margin, y, imageW, galH, leftRot);
      } else {
        await drawImageContained(galleryImage, margin, y, imageW, galH);
      }

      if (rightRot) {
        await drawImageContainedRotated(highlightImage, margin + imageW + gap, y, imageW, galH, rightRot);
      } else {
        await drawImageContained(highlightImage, margin + imageW + gap, y, imageW, galH);
      }
        y += galH + 8;
    } else if (galleryImage) {
        await drawImageContained(galleryImage, margin, y, contentWidth, galH);
        y += galH + 8;
    }

    // --- Footer Lockup (Bottom of Page 3) ---
    const footerH = 35;
    const footerY = pageHeight - footerH - margin;

    // --- Page 3 Highlight Image (Before footer) ---
    // If we already used highlightImage in the side-by-side block, skip this.
    if (options.page3Image && !highlightImage) {
      // Calculate available space between gallery and footer
      const availableH = footerY - y - 5;
      // Reduced threshold to 15mm
      if (availableH > 15) { 
         // Fill available space
         const targetH = availableH; 
         await drawImageContained(options.page3Image, margin, y, contentWidth, targetH);
         y += targetH + 10;
      }
    }
    
    doc.setFillColor(colors.surface[0], colors.surface[1], colors.surface[2]);
    doc.roundedRect(margin, footerY, contentWidth, footerH, 2, 2, 'F');
    
    addText('CONNECT & BOOK', margin + 10, footerY + 10, 12, colors.accent);
    const contactInfo = `Email: ${artistData.email || 'melissa@bngmusicentertainment.com'}`;
    addText(contactInfo, margin + 10, footerY + 24, 10, colors.text);
    
    // Social Pills on right side
    const socialLinks = options.socialLinks || [];
    let pillX = margin + (contentWidth / 2);
    let pillY = footerY + 8;
    
    socialLinks.slice(0, 6).forEach((link, idx) => {
        // 2 rows of 3
        if (idx === 3) {
            pillX = margin + (contentWidth / 2);
            pillY += 10; 
        }
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        const txt = link.platform;
        const w = doc.getTextWidth(txt) + 8;
        
        doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
        doc.roundedRect(pillX, pillY, w, 6, 1, 1, 'F');
        doc.setLineWidth(0.1);
        doc.rect(pillX, pillY, w, 6, 'S'); // border
        
        doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.text(txt, pillX + 4, pillY + 4);
        doc.link(pillX, pillY, w, 6, { url: link.url });
        
        pillX += w + 4;
    });
    
    doc.setFontSize(9);
    doc.setTextColor(colors.textSec[0], colors.textSec[1], colors.textSec[2]);
    doc.text("4 / 4", pageWidth - margin, pageHeight - margin, { align: 'right' });


    resolve(doc);
  });
}
