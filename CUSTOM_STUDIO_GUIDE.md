# Neural Silhouette Engine - Custom Studio

## Overview
The **Neural Silhouette Engine** is a powerful custom art creation tool that transforms text descriptions or uploaded images into laser-cut wall art previews with glowing halo effects.

## Features

### 🎨 Dual Input Modes

#### 1. AI Text-to-Art (Powered by DALL-E)
- Enter any text description (e.g., "Mountain landscape with trees")
- AI generates a high-contrast silhouette design
- Automatically optimized for laser-cut aesthetics
- Uses enhanced prompts for stencil-style output

#### 2. Image Upload Converter
- Upload any photo (PNG, JPG, up to 10MB)
- Automatic image processing to create silhouette effect
- Adjustable contrast and brightness controls
- Real-time preview of laser-cut simulation

### ✨ Advanced Editor Features

#### Transform Controls
- **Invert**: Swap black/white (essential for logos and text)
- **Flip**: Horizontal mirror for reversed designs

#### Glow Color Selection (5 Options)
- **Warm White** (Default) - Classic halo effect
- **Gold** - Luxury ambience
- **Red** - Bold and dramatic
- **Cyan Blue** - Modern and cool
- **Neon Green** - Vibrant and energetic

#### Image Processing (Upload Mode Only)
- **Contrast Slider**: 100% - 500% (adjusts edge definition)
- **Brightness Slider**: 50% - 200% (fine-tunes silhouette darkness)

### 🎯 Smart Silhouette Filter

The core "Neural Processor" applies these filters automatically:
```css
/* For AI-generated images */
mix-blend-mode: multiply (removes white background)

/* For uploaded images */
grayscale(100%) → contrast(200%) → brightness(100%)

/* Glow Effect (all images) */
drop-shadow(0 0 15px rgba(color)) + drop-shadow(0 0 30px rgba(color))
```

### 📦 Quote Capture System

When users click **"GET CUSTOM QUOTE"**, the system captures:
- Original image/text input
- Final processed state
- All transformation settings (inverted, flipped, glow color)
- Timestamp for order tracking

## Setup Instructions

### 1. Environment Configuration

Add your OpenAI API key to `.env`:

```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

### 2. API Key Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys section
3. Create a new secret key
4. Copy and paste into `.env` file
5. **Important**: Add `.env` to `.gitignore` to keep keys private

### 3. Test the Feature

Navigate to: `http://localhost:5173/custom-studio`

#### Test AI Mode:
1. Click "AI TEXT-TO-ART"
2. Enter: "Mountain landscape with pine trees"
3. Click "GENERATE ARTWORK"
4. Wait 10-15 seconds for DALL-E to generate
5. Use editor tools to customize

#### Test Upload Mode:
1. Click "IMAGE UPLOAD"
2. Upload any photo
3. Adjust contrast/brightness sliders
4. Toggle invert/flip as needed
5. Change glow color

## Technical Architecture

### File Structure
```
src/pages/CustomStudioPage.jsx  → Main component
src/App.jsx                     → Route configuration
```

### State Management
- `inputMode`: 'text' | 'image'
- `textPrompt`: User's AI generation prompt
- `uploadedImage`: Base64 uploaded image data
- `generatedImage`: DALL-E returned image URL
- `isInverted`: Boolean for color inversion
- `isFlipped`: Boolean for horizontal flip
- `glowColor`: Selected glow preset key
- `contrast`: 100-500 (upload mode)
- `brightness`: 50-200 (upload mode)

### Preview Rendering Logic

```javascript
// Get current active image
const getCurrentImage = () => {
  if (inputMode === 'image' && uploadedImage) return uploadedImage;
  if (inputMode === 'text' && generatedImage) return generatedImage;
  return null;
};

// Apply silhouette filters
filter: grayscale(100%) contrast(200%) brightness(100%) invert(?)
transform: scaleX(-1) // if flipped
mixBlendMode: multiply // if AI-generated
```

### API Integration

#### DALL-E 3 Generation
```javascript
POST https://api.openai.com/v1/images/generations
{
  "model": "dall-e-3",
  "prompt": "Enhanced silhouette prompt...",
  "size": "1024x1024",
  "quality": "standard"
}
```

## Design Philosophy

### The "Black Box" Processor
The preview canvas simulates a **real dark wall** with:
- Gradient background (zinc-900 → zinc-800 → black)
- Subtle texture overlay (SVG pattern)
- Realistic lighting and shadows
- Professional product visualization

### Silhouette Optimization
All inputs are converted to:
1. **Pure black shapes** (via grayscale + high contrast)
2. **Crisp edges** (brightness adjustments)
3. **Glowing halo** (multi-layered drop shadows)
4. **Wall-mounted look** (textured background + depth)

## Future Enhancements

### Planned Features
- [ ] Background removal API integration (remove.bg)
- [ ] Manual masking tool (crop unwanted areas)
- [ ] Size selector (Small, Medium, Large, Custom)
- [ ] Material selection (Acrylic, Wood, Metal)
- [ ] Price calculator based on size + material
- [ ] Direct quote form integration
- [ ] Download processed preview (PNG export)
- [ ] Save designs to user account
- [ ] Design gallery (browse previous creations)

### Advanced Processing
- [ ] SVG auto-tracing for vector output
- [ ] Edge smoothing algorithms
- [ ] Multi-layer designs (multiple colors)
- [ ] Animation preview (pulsing glow effect)

## Troubleshooting

### AI Generation Not Working
- **Check API Key**: Verify `VITE_OPENAI_API_KEY` in `.env`
- **Check Console**: Look for error messages
- **API Credits**: Ensure OpenAI account has credits
- **CORS Issues**: DALL-E API should work from browser (no proxy needed)

### Image Upload Issues
- **File Size**: Must be under 10MB
- **File Type**: Only PNG, JPG, JPEG accepted
- **Browser Console**: Check for FileReader errors

### Glow Not Showing
- **Image Background**: Works best with transparent PNG
- **High Contrast**: Uploaded images need contrast adjustment
- **CSS Filters**: Check browser DevTools for applied styles

### Preview Looks Wrong
- **Invert Toggle**: Try toggling inversion (crucial for logos)
- **Contrast Slider**: Adjust for better edge definition
- **Brightness Slider**: Fine-tune silhouette darkness
- **Image Quality**: Higher resolution inputs = better results

## Performance Notes

- **AI Generation**: 10-15 seconds (DALL-E API speed)
- **Image Upload**: Instant (processed client-side)
- **Filter Changes**: Real-time (CSS only, no re-processing)
- **Memory**: Large images use more browser memory

## Cost Considerations

### DALL-E 3 Pricing (as of 2024)
- Standard Quality: ~$0.04 per image
- 1024x1024 resolution
- Each "GENERATE ARTWORK" click = 1 API call

**Recommendation**: Add usage limits or user authentication to control costs.

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note**: CSS filters and FileReader API are well-supported in modern browsers.

## Security Considerations

1. **API Key Protection**: Never commit `.env` file
2. **File Upload Validation**: Size and type checks implemented
3. **XSS Prevention**: React auto-escapes user input
4. **Image Sources**: Only user-uploaded or OpenAI-returned images

## Support

For issues or feature requests, contact: devesh@deeprootstudios.com

---

**Built with** ❤️ **by Deep Root Studios**
