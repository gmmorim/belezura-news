import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  postImageUploader: f({
    image: {
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
    "image/jpeg": {
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
    "image/png": {
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
    "image/webp": {
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
