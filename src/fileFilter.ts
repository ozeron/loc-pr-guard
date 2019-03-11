interface File {
    filename: string;
}

export default function fileFilter (file: File) {
  return !file.filename.includes('spec/')
}
