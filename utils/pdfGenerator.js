import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to add text with word wrapping
const addWrappedText = (doc, text, x, y, maxWidth, lineHeight, options = {}) => {
  const defaultOptions = { align: 'left', fontSize: 12, font: 'helvetica', fontStyle: 'normal' };
  const { align, fontSize, font, fontStyle } = { ...defaultOptions, ...options };
  
  // Set text properties
  doc.setFontSize(fontSize);
  doc.setFont(font, fontStyle);
  
  // Clean the text for HTML tags and replace line breaks
  // And completely remove emojis instead of replacing them
  const cleanText = text.replace(/<[^>]*>?/gm, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        // Remove common emojis completely
                        .replace(/[✨❤️🔥👑💯💰🎵🎤]/g, '')
                        // Handle other non-standard characters
                        .replace(/[^\x00-\x7F]/g, char => {
                          // If it's not a standard ASCII character, try to handle it
                          // or remove it if unsupported
                          try {
                            return char;
                          } catch (e) {
                            return '';
                          }
                        });
  
  // Split text to lines
  const lines = doc.splitTextToSize(cleanText, maxWidth);
  
  // Add each line to document
  for (let i = 0; i < lines.length; i++) {
    doc.text(lines[i], x, y + (i * lineHeight), { align });
  }
  
  // Return the new y position after the text block
  return y + (lines.length * lineHeight);
};

// Helper function to add a section header
const addSectionHeader = (doc, text, x, y, maxWidth) => {
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(text, x, y);
  
  // Add underline
  const textWidth = Math.min(doc.getStringUnitWidth(text) * 18 / doc.internal.scaleFactor, maxWidth);
  y += 1; // Small offset for underline
  doc.setLineWidth(0.5);
  doc.line(x, y, x + textWidth, y);
  
  return y + 10; // Return position after header with spacing
};

// Helper function to add a subheader
const addSubHeader = (doc, text, x, y) => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(text, x, y);
  return y + 8; // Return position after subheader with spacing
};

// Helper function to add a clickable link
const addLink = (doc, text, url, x, y, maxWidth, lineHeight) => {
  const fontSize = 12;
  doc.setFontSize(fontSize);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 255); // Blue color for links
  
  const lines = doc.splitTextToSize(text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    const textX = x;
    const textY = y + (i * lineHeight);
    doc.text(lines[i], textX, textY);
    
    const textWidth = doc.getStringUnitWidth(lines[i]) * fontSize / doc.internal.scaleFactor;
    doc.link(textX, textY - fontSize/2, textWidth, fontSize, { url });
  }
  
  doc.setTextColor(0, 0, 0); // Reset to black text color
  return y + (lines.length * lineHeight);
};

// Generate EPK PDF with provided data
export async function generateEPK(artistData, musicData, videoData, pressData, imageUrls) {
  return new Promise(async (resolve) => {
    // Create new PDF document (A4 format, portrait)
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = 20;
    
    // Function to check if we need a page break
    const checkPageBreak = (y, neededSpace) => {
      if (y + neededSpace > pageHeight - margin) {
        doc.addPage();
        return margin; // Return top margin of new page
      }
      return y; // Return current y if no page break needed
    };

    // --- COVER PAGE WITH HEADER IMAGE ---
    
    // Add title
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(`${artistData.name}`, pageWidth/2, yPosition, { align: 'center' });
    yPosition += 10;
    
    // Add subtitle
    doc.setFontSize(20);
    doc.setFont('helvetica', 'italic');
    doc.text('Hip-Hop Visionary | Performer | Fashion Icon', pageWidth/2, yPosition, { align: 'center' });
    yPosition += 20;

    // Add a random image as header if available
    if (imageUrls && imageUrls.length > 0) {
      try {
        // Use the first image as profile image
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrls[0];
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        // Calculate image dimensions to fit within content width
        const imgAspectRatio = img.width / img.height;
        const imgWidth = Math.min(contentWidth, 160);
        const imgHeight = imgWidth / imgAspectRatio;
        
        // Add image to PDF (centered)
        const imgX = margin + (contentWidth - imgWidth) / 2;
        doc.addImage(img, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 15;
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        yPosition += 15; // Add some extra space if image fails
      }
    }

    // --- BIOGRAPHY SECTION ---
    
    yPosition = checkPageBreak(yPosition, 40);
    yPosition = addSectionHeader(doc, 'BIOGRAPHY', margin, yPosition, contentWidth);
    
    // Handle bio sections - split by paragraphs and format nicely
    const bioText = artistData.longBio.replace(/<[^>]*>?/gm, '');
    const paragraphs = bioText.split(/\n\n|\r\n\r\n|\r\r/);
    
    paragraphs.forEach(paragraph => {
      if (paragraph.trim()) {
        yPosition = checkPageBreak(yPosition, 20);
        yPosition = addWrappedText(doc, paragraph.trim(), margin, yPosition, contentWidth, 6);
        yPosition += 5; // Space between paragraphs
      }
    });
    
    yPosition += 10; // Extra space after biography

    // --- CONTACT INFORMATION ---
    
    yPosition = checkPageBreak(yPosition, 40);
    yPosition = addSectionHeader(doc, 'CONTACT & SOCIAL MEDIA', margin, yPosition, contentWidth);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    if (artistData.email) {
      yPosition = addSubHeader(doc, 'Email', margin, yPosition);
      yPosition = addLink(doc, artistData.email, `mailto:${artistData.email}`, margin, yPosition, contentWidth, 6);
      yPosition += 5;
    }
    
    yPosition = addSubHeader(doc, 'Website', margin, yPosition);
    const websiteUrl = "https://bngmusicentertainment.com";
    yPosition = addLink(doc, websiteUrl, websiteUrl, margin, yPosition, contentWidth, 6);
    yPosition += 10;
    
    // Social Media section with all links from SocialFollow component
    yPosition = addSubHeader(doc, 'Social Media', margin, yPosition);
    
    // Add all social media links from SocialFollow component
    const socialLinks = [
      { platform: 'Spotify', url: 'https://open.spotify.com/artist/7DTwqaiSpmjzxnoBrRJeXe' },
      { platform: 'Apple Music', url: 'https://music.apple.com/us/artist/bng-nappsakk/1599225835' },
      { platform: 'SoundCloud', url: 'https://soundcloud.com/search?q=bng%20nappsakk' },
      { platform: 'YouTube', url: 'https://www.youtube.com/@bngnappsakk' },
      { platform: 'Instagram', url: 'https://www.instagram.com/bng_nappsakk/' },
      { platform: 'Twitter', url: 'https://x.com/BNG_Nappsakk' },
      { platform: 'Facebook', url: 'https://www.facebook.com/napp.sakk.9' },
      { platform: 'TikTok', url: 'https://www.tiktok.com/@bng_nappsakk' },
    ];

    // Group social media links into categories for better organization
    const musicPlatforms = ['Spotify', 'Apple Music', 'SoundCloud'];
    const videoPlatforms = ['YouTube'];
    const socialPlatforms = ['Instagram', 'Twitter', 'Facebook', 'TikTok'];

    // Add music streaming platforms
    yPosition = addWrappedText(doc, 'Music Streaming:', margin, yPosition, contentWidth, 6, { fontStyle: 'bold' });
    yPosition += 2;
    
    socialLinks
      .filter(link => musicPlatforms.includes(link.platform))
      .forEach(link => {
        yPosition = addLink(doc, `${link.platform}: ${link.url}`, link.url, margin + 5, yPosition, contentWidth - 10, 6);
        yPosition += 4;
      });
    yPosition += 5;

    // Add video platforms
    yPosition = addWrappedText(doc, 'Video Platform:', margin, yPosition, contentWidth, 6, { fontStyle: 'bold' });
    yPosition += 2;
    
    socialLinks
      .filter(link => videoPlatforms.includes(link.platform))
      .forEach(link => {
        yPosition = addLink(doc, `${link.platform}: ${link.url}`, link.url, margin + 5, yPosition, contentWidth - 10, 6);
        yPosition += 4;
      });
    yPosition += 5;

    // Add social media platforms
    yPosition = addWrappedText(doc, 'Social Media:', margin, yPosition, contentWidth, 6, { fontStyle: 'bold' });
    yPosition += 2;
    
    socialLinks
      .filter(link => socialPlatforms.includes(link.platform))
      .forEach(link => {
        yPosition = addLink(doc, `${link.platform}: ${link.url}`, link.url, margin + 5, yPosition, contentWidth - 10, 6);
        yPosition += 4;
      });
    
    yPosition += 10; // Extra space after contact section

    // --- MUSIC SECTION ---
    
    yPosition = checkPageBreak(yPosition, 40);
    yPosition = addSectionHeader(doc, 'MUSIC', margin, yPosition, contentWidth);
    
    if (musicData && musicData.length > 0) {
      musicData.forEach((track, index) => {
        // Check if we need a page break before each track
        yPosition = checkPageBreak(yPosition, 25);
        
        // Title with number for each track
        yPosition = addSubHeader(doc, `${index + 1}. ${track.title}`, margin, yPosition);
        
        // Add clickable links to streaming platforms
        if (track.spotify_link) {
          yPosition = addLink(doc, `Spotify: ${track.spotify_link}`, track.spotify_link, margin + 5, yPosition, contentWidth - 10, 5);
        }
        
        if (track.apple_music_link) {
          yPosition = addLink(doc, `Apple Music: ${track.apple_music_link}`, track.apple_music_link, margin + 5, yPosition, contentWidth - 10, 5);
        }
        
        if (track.youtube_link) {
          yPosition = addLink(doc, `YouTube: ${track.youtube_link}`, track.youtube_link, margin + 5, yPosition, contentWidth - 10, 5);
        }
        
        yPosition += 8; // Space between tracks
      });
    } else {
      yPosition = addWrappedText(doc, 'No music entries found.', margin, yPosition, contentWidth, 6);
      yPosition += 10;
    }
    
    // --- VIDEOS SECTION ---
    
    yPosition = checkPageBreak(yPosition, 40);
    yPosition = addSectionHeader(doc, 'VIDEOS', margin, yPosition, contentWidth);
    
    if (videoData && videoData.length > 0) {
      videoData.forEach((video, index) => {
        yPosition = checkPageBreak(yPosition, 25);
        
        // Format platform appropriately
        const platform = video.medium ? video.medium.toLowerCase() : 'youtube';
        const videoUrl = platform === 'youtube' 
          ? `https://www.youtube.com/watch?v=${video.video_id}`
          : (platform === 'facebook' ? video.video_id : `https://vimeo.com/${video.video_id}`);
        
        // Title with number
        const videoTitle = video.title || `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video ${index + 1}`;
        yPosition = addSubHeader(doc, `${index + 1}. ${videoTitle}`, margin, yPosition);
        
        // Add clickable link
        yPosition = addLink(doc, `Watch on ${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${videoUrl}`, videoUrl, margin + 5, yPosition, contentWidth - 10, 5);
        
        yPosition += 8; // Space between videos
      });
    } else {
      yPosition = addWrappedText(doc, 'No video entries found.', margin, yPosition, contentWidth, 6);
      yPosition += 10;
    }
    
    // --- IMAGES GALLERY SECTION ---
    
    if (imageUrls && imageUrls.length > 1) { // Skip first image (used as header)
      doc.addPage(); // Always start photo gallery on a new page
      yPosition = 20;
      
      yPosition = addSectionHeader(doc, 'PHOTO GALLERY', margin, yPosition, contentWidth);
      
      // Add introduction text
      yPosition = addWrappedText(doc, 'The following images are available for promotional use. Please credit the photographer where applicable.', margin, yPosition, contentWidth, 6);
      yPosition += 10;
      
      // Calculate image placement parameters (2 images per row)
      const imagesPerRow = 2;
      const imageWidth = (contentWidth - 10) / imagesPerRow; // 10 = gap between images
      const maxImageHeight = 90; // Maximum image height
      
      // Skip the first image (used as header) and process the rest
      const galleryImages = imageUrls.slice(1);
      
      // Process images in pairs
      for (let i = 0; i < galleryImages.length; i += imagesPerRow) {
        yPosition = checkPageBreak(yPosition, maxImageHeight + 20);
        
        // Process each image in the current row (up to imagesPerRow images)
        for (let j = 0; j < imagesPerRow; j++) {
          const imageIndex = i + j;
          
          if (imageIndex < galleryImages.length) {
            try {
              const img = new Image();
              img.crossOrigin = 'Anonymous';
              img.src = galleryImages[imageIndex];
              
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
              });
              
              // Calculate image dimensions to fit within the allocated space
              const imgAspectRatio = img.width / img.height;
              const imgHeight = Math.min(maxImageHeight, imageWidth / imgAspectRatio);
              const finalImageWidth = imgHeight * imgAspectRatio;
              
              // Calculate x position for the image
              const imgX = margin + j * (imageWidth + 10/imagesPerRow);
              
              // Add image to PDF
              doc.addImage(img, 'JPEG', imgX, yPosition, finalImageWidth, imgHeight);
            } catch (error) {
              console.error(`Error adding gallery image ${imageIndex} to PDF:`, error);
              // Add a placeholder if image fails
              doc.setFillColor(200, 200, 200);
              doc.rect(margin + j * (imageWidth + 10/imagesPerRow), yPosition, imageWidth - 10/imagesPerRow, maxImageHeight/2, 'F');
              doc.setTextColor(100, 100, 100);
              doc.text('Image Not Available', margin + j * (imageWidth + 10/imagesPerRow) + 10, yPosition + maxImageHeight/4);
              doc.setTextColor(0, 0, 0);
            }
          }
        }
        
        yPosition += maxImageHeight + 15; // Add space after each row of images
      }
    }

    // --- FOOTER ON ALL PAGES ---
    
    // Add page number and generation date to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      
      // Add page number
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 10);
      
      // Add generation date on last page
      if (i === pageCount) {
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
      }
      
      // Add artist name in footer
      doc.text(artistData.name, margin, pageHeight - 10);
    }

    resolve(doc);
  });
}

export default generateEPK;
