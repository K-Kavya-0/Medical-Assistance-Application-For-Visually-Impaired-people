import pytesseract
from PIL import Image
from fastapi import UploadFile, HTTPException

def extract_text_from_image(file: UploadFile) -> str:
    try:
        image = Image.open(file.file)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")
