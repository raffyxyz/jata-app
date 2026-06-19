import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getResumes, saveResume, deleteResume } from "../db";
import {
  savePdfFile,
  deletePdfFile,
  extractPdfText,
} from "../services/pdf";
import { notify } from "../notification";

export function useResumesQuery() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });
}

export function useUploadResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const buffer = await file.arrayBuffer();
      const fileData = Array.from(new Uint8Array(buffer));
      const parsedText = await extractPdfText(buffer);
      const filePath = await savePdfFile(file.name, fileData);
      await saveResume(file.name, filePath, parsedText);
    },
    onSuccess: (_data, file) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      notify("Resume Uploaded", file.name);
    },
    onError: () => {
      notify("Upload Failed", "Could not upload the resume file.");
    },
  });
}

export function useDeleteResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteResume(id);
      if (result?.filePath) {
        try {
          await deletePdfFile(result.filePath);
        } catch {
          /* file may already be gone */
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      notify("Resume Deleted", "");
    },
  });
}
