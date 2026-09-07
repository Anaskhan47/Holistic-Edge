import os
from PIL import Image, ImageDraw

def generate_favicon_suite():
    print("=== Generating Holistic Edge Favicon Suite ===")
    
    # 1. Load the official logo image
    logo_path = 'public/brand/holistic-edge-official-logo.png'
    if not os.path.exists(logo_path):
        raise FileNotFoundError(f"Logo not found at {logo_path}")
        
    img = Image.open(logo_path).convert('RGBA')
    print(f"Loaded logo: {img.size}")
    
    # The emblem is located at x=(34, 238), y=(56, 276)
    # Width = 205, Height = 221
    emblem_crop = img.crop((34, 56, 239, 277))
    ew, eh = emblem_crop.size
    print(f"Emblem crop size: {ew} x {eh}")
    
    # Create master 512x512 icons:
    # A. Circular badge with crisp white backing & subtle anti-aliased border
    # This ensures high contrast and visibility on dark browser tabs, light tabs, and mobile home screens
    badge_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(badge_512)
    # Draw clean white circular background
    draw.ellipse((8, 8, 504, 504), fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=4)
    
    # Scale emblem to fit nicely inside circle with comfortable margins
    scale = 400.0 / max(ew, eh)
    nw, nh = int(round(ew * scale)), int(round(eh * scale))
    emblem_scaled = emblem_crop.resize((nw, nh), Image.Resampling.LANCZOS)
    
    offset_x = (512 - nw) // 2
    offset_y = (512 - nh) // 2
    badge_512.paste(emblem_scaled, (offset_x, offset_y), emblem_scaled)
    
    # B. Transparent background master 512x512
    trans_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    scale_trans = 460.0 / max(ew, eh)
    ntw, nth = int(round(ew * scale_trans)), int(round(eh * scale_trans))
    emblem_trans_scaled = emblem_crop.resize((ntw, nth), Image.Resampling.LANCZOS)
    trans_512.paste(emblem_trans_scaled, ((512 - ntw) // 2, ((512 - nth) // 2)), emblem_trans_scaled)
    
    # Save master high-res icons in public/brand/
    badge_512.save('public/brand/holistic-edge-icon-badge-512.png', 'PNG')
    trans_512.save('public/brand/holistic-edge-icon-trans-512.png', 'PNG')
    badge_512.save('public/brand/holistic-edge-icon.png', 'PNG')
    trans_512.save('public/brand/holistic-edge-emblem.png', 'PNG')
    print("Saved master icons in public/brand/")
    
    # 2. Generate standard web favicon sizes
    # 512x512 (Android Chrome)
    badge_512.save('public/android-chrome-512x512.png', 'PNG')
    
    # 192x192 (Android Chrome standard)
    icon_192 = badge_512.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save('public/android-chrome-192x192.png', 'PNG')
    
    # 180x180 (Apple Touch Icon for iOS Safari)
    icon_180 = badge_512.resize((180, 180), Image.Resampling.LANCZOS)
    icon_180.save('public/apple-touch-icon.png', 'PNG')
    
    # 64x64 (Desktop shortcuts)
    icon_64 = badge_512.resize((64, 64), Image.Resampling.LANCZOS)
    icon_64.save('public/favicon-64x64.png', 'PNG')
    
    # 48x48 (Google Search Snippet Favicon standard)
    icon_48 = badge_512.resize((48, 48), Image.Resampling.LANCZOS)
    icon_48.save('public/favicon-48x48.png', 'PNG')
    
    # 32x32 (Desktop Retina browser tab)
    icon_32 = badge_512.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32.save('public/favicon-32x32.png', 'PNG')
    icon_32.save('public/favicon.png', 'PNG')
    
    # 16x16 (Desktop Standard browser tab)
    icon_16 = badge_512.resize((16, 16), Image.Resampling.LANCZOS)
    icon_16.save('public/favicon-16x16.png', 'PNG')
    
    # 3. Generate true multi-frame Windows ICO file: favicon.ico
    # Multi-size ICO containing 16x16, 32x32, 48x48, 64x64
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    badge_512.save('public/favicon.ico', format='ICO', sizes=ico_sizes)
    print("Saved true multi-resolution public/favicon.ico")
    
    # Verify the generated favicon.ico header
    with open('public/favicon.ico', 'rb') as f:
        header = f.read(6)
        print("favicon.ico header bytes:", header.hex(), "(00000100xxxx indicates valid ICO!)")
        
    print("=== Favicon Suite Generation Completed Successfully! ===")

if __name__ == '__main__':
    generate_favicon_suite()
