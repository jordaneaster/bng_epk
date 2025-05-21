export async function generateEPK(artistData, musicData, videoData, pressData, imageUrls) {
  return new Promise(async (resolve) => {
    // Import jsPDF dynamically to avoid server-side errors
    const { jsPDF } = await import('jspdf');
    
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

    // Add section header
    const addSectionHeader = (doc, text, x, y, width) => {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 60, 0); // Use primary color
      doc.text(text, x, y);
      
      // Add underline
      doc.setDrawColor(255, 60, 0);
      doc.setLineWidth(0.5);
      doc.line(x, y + 2, x + width, y + 2);
      
      return y + 10; // Return new y position
    };
    
    // Add sub header
    const addSubHeader = (doc, text, x, y) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(text, x, y);
      return y + 6; // Return new y position
    };
    
    // Add wrapped text
    const addWrappedText = (doc, text, x, y, width, lineHeight, options = {}) => {
      const { align = 'left', fontStyle = 'normal' } = options;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', fontStyle);
      
      // Split the text to fit within the width
      const lines = doc.splitTextToSize(text, width);
      
      // Calculate text height
      const textHeight = lines.length * lineHeight;
      
      // Check for page break
      y = checkPageBreak(y, textHeight);
      
      // Add text lines
      lines.forEach((line, i) => {
        doc.text(line, align === 'center' ? (x + width / 2) : x, y + (i * lineHeight), { align });
      });
      
      return y + textHeight; // Return new y position
    };
    
    // Add clickable link
    const addLink = (doc, text, url, x, y, width, lineHeight) => {
      const lines = doc.splitTextToSize(text, width);
      const textHeight = lines.length * lineHeight;
      
      // Check for page break
      y = checkPageBreak(y, textHeight);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 102, 204); // Link color
      
      lines.forEach((line, i) => {
        // Add the text first
        doc.text(line, x, y + (i * lineHeight));
        
        // Get text width for the link
        const textWidth = doc.getTextWidth(line);
        
        // Add the link
        doc.link(x, y + (i * lineHeight) - 5, textWidth, lineHeight + 2, { url });
      });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      return y + textHeight; // Return new y position
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
              const imgWidth = imageWidth;
              const imgHeight = Math.min(imgWidth / imgAspectRatio, maxImageHeight);
              
              // Calculate x position
              const imgX = margin + (j * (imageWidth + 5)); // Add gap between images
              
              // Add image to PDF
              doc.addImage(img, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
            } catch (error) {
              console.error(`Error adding gallery image ${imageIndex}:`, error);
            }
          }
        }
        
        yPosition += maxImageHeight + 15; // Move to next row with spacing
      }
    }
    
    // Return the created PDF
    resolve(doc);
  });
}
