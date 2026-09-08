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
    
    # Create master 512x512 square icon on clean white background:
    # Optimized for high contrast and maximum readability at small display sizes (16px, 32px, 48px)
    # Fills 92% of the square canvas so the emblem is bold, distinct, and without excessive padding
    master_512 = Image.new('RGBA', (512, 512), (255, 255, 255, 255))
    
    # Scale emblem to 470px (92% of 512) for maximum visibility at 16x16 / 48x48
    scale = 470.0 / max(ew, eh)
    nw, nh = int(round(ew * scale)), int(round(eh * scale))
    emblem_scaled = emblem_crop.resize((nw, nh), Image.Resampling.LANCZOS)
    
    offset_x = (512 - nw) // 2
    offset_y = (512 - nh) // 2
    master_512.paste(emblem_scaled, (offset_x, offset_y), emblem_scaled)
    
    # Transparent version for platforms that support it
    trans_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    trans_512.paste(emblem_scaled, (offset_x, offset_y), emblem_scaled)
    
    # Save master high-res icons in public/brand/
    master_512.save('public/brand/holistic-edge-icon-badge-512.png', 'PNG')
    trans_512.save('public/brand/holistic-edge-icon-trans-512.png', 'PNG')
    master_512.save('public/brand/holistic-edge-icon.png', 'PNG')
    trans_512.save('public/brand/holistic-edge-emblem.png', 'PNG')
    print("Saved master icons in public/brand/")
    
    # 2. Generate standard web favicon sizes
    # 512x512 (Android Chrome)
    master_512.save('public/android-chrome-512x512.png', 'PNG')
    
    # 192x192 (Android Chrome standard)
    icon_192 = master_512.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save('public/android-chrome-192x192.png', 'PNG')
    
    # 180x180 (Apple Touch Icon for iOS Safari)
    icon_180 = master_512.resize((180, 180), Image.Resampling.LANCZOS)
    icon_180.save('public/apple-touch-icon.png', 'PNG')
    
    # 64x64 (Desktop shortcuts)
    icon_64 = master_512.resize((64, 64), Image.Resampling.LANCZOS)
    icon_64.save('public/favicon-64x64.png', 'PNG')
    
    # 48x48 (Google Search Snippet Favicon standard - REQUIRED MULTIPLE OF 48px)
    icon_48 = master_512.resize((48, 48), Image.Resampling.LANCZOS)
    icon_48.save('public/favicon-48x48.png', 'PNG')
    
    # 32x32 (Desktop Retina browser tab)
    icon_32 = master_512.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32.save('public/favicon-32x32.png', 'PNG')
    icon_32.save('public/favicon.png', 'PNG')
    
    # 16x16 (Desktop Standard browser tab)
    icon_16 = master_512.resize((16, 16), Image.Resampling.LANCZOS)
    icon_16.save('public/favicon-16x16.png', 'PNG')
    
    # 3. Generate true multi-frame Windows ICO file: favicon.ico
    # Multi-size ICO containing 16x16, 32x32, 48x48, 64x64
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    master_512.save('public/favicon.ico', format='ICO', sizes=ico_sizes)
    # Verify the generated favicon.ico header
    with open('public/favicon.ico', 'rb') as f:
        header = f.read(6)
        print("favicon.ico header bytes:", header.hex(), "(00000100xxxx indicates valid ICO!)")
        
    print("=== Favicon Suite Generation Completed Successfully! ===")

if __name__ == '__main__':
    generate_favicon_suite()
