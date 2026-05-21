#!/usr/bin/env python3
"""
Generates resized WebP variants for every image under uploads/.
Outputs go to uploads/optimized/{subfolder}/{name}-{width}w.webp.
Already-generated files are skipped, so only new images are processed.
"""
from pathlib import Path
from PIL import Image

WIDTHS = [400, 800, 1600]
QUALITY = 85
UPLOADS_DIR = Path("uploads")
OUTPUT_DIR = UPLOADS_DIR / "optimized"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def process_image(img_path: Path) -> int:
    rel = img_path.relative_to(UPLOADS_DIR)
    out_dir = OUTPUT_DIR / rel.parent
    out_dir.mkdir(parents=True, exist_ok=True)

    name = img_path.stem
    generated = 0

    for width in WIDTHS:
        out_path = out_dir / f"{name}-{width}w.webp"
        if out_path.exists():
            continue

        with Image.open(img_path) as img:
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGB")

            # Only downscale, never upscale
            if img.width > width:
                ratio = width / img.width
                img = img.resize((width, int(img.height * ratio)), Image.LANCZOS)

            img.save(out_path, "WEBP", quality=QUALITY, method=6)
            print(f"  {img_path} -> {out_path}")
            generated += 1

    return generated


def main():
    total = 0
    for img_path in sorted(UPLOADS_DIR.rglob("*")):
        if img_path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        if "optimized" in img_path.parts:
            continue
        total += process_image(img_path)

    print(f"\nDone. Generated {total} new optimized images.")


if __name__ == "__main__":
    main()
