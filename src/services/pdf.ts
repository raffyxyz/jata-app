import { invoke } from "@tauri-apps/api/core";
import { PDFParse } from "pdf-parse";

export async function readPdfBytes(filePath: string): Promise<Uint8Array> {
  const data = await invoke<number[]>("read_pdf", { filePath });
  return new Uint8Array(data);
}

export async function savePdfFile(
  fileName: string,
  fileData: number[]
): Promise<string> {
  return invoke<string>("save_pdf", { fileName, fileData });
}

export async function deletePdfFile(filePath: string): Promise<void> {
  await invoke("delete_pdf_file", { filePath });
}

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    parser.destroy();
    return result.text;
  } catch {
    return "";
  }
}

export function base64ToUint8Array(dataUri: string): Uint8Array {
  const byteString = atob(dataUri.split(",")[1]);
  const array = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    array[i] = byteString.charCodeAt(i);
  }
  return array;
}
