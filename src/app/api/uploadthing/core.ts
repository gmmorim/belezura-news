import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  postImageUploader: f({
    image: {
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Middleware simplificado para isolar validações de sessão
      return { userId: "admin-bypass" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Upload concluído com sucesso:", file.url);
      return { url: file.url, ufsUrl: (file as any).ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
