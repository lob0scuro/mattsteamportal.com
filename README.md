# IT Setup: Poppler for PDF → PNG Conversion on Windows

This project uses [`pdf2image`](https://pypi.org/project/pdf2image/) to convert PDFs to PNGs. On Windows, you need **Poppler**, a PDF rendering library. As the IT administrator, you can standardize installation across all machines.

---

## 1. Download Poppler

- Official GitHub releases:  
  [https://github.com/oschwartz10612/poppler-windows/releases/](https://github.com/oschwartz10612/poppler-windows/releases/)
- Download the latest stable **binary zip** (e.g., `poppler-24.02.0-x86_64.zip`).

---

## 2. Extract Poppler

- Extract the zip to a consistent location on all machines, for example: C:\Program Files\poppler

- The executables we need are in: C:\Program Files\poppler\Library\bin

---

## 3. Add Poppler to the System PATH

1. Press **Win + S**, type `Environment Variables`, and open **Edit the system environment variables**.
2. Click **Environment Variables…**
3. Under **System variables**, select `Path` → **Edit…** → **New**
4. Paste the full path to the `bin` folder:

pdf2image → converts PDFs to images

Pillow → saves images as PNG

Open Command Prompt and run: pdftoppm -h
You should see usage instructions for Poppler. If so, installation is successful.
