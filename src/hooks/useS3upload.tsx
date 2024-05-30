import { useState } from "react";
import axios from "@/lib/utils/axios";

const useFileUploadS3 = () => {
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const onUploadProgress = (progressEvent: any) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    if (percentCompleted % 10 === 0) {
      setUploadPercent(() => percentCompleted);
    }
  };

  const onUploadToS3 = async (acceptedFiles: any[]) => {
    console.log(acceptedFiles, "FILES-UPLOAD");
    const file = acceptedFiles[0];
    setIsUploading(true);

    const fileUploadOptions = {
      mimeType: file.type,
    };
    const FILE_UPLOAD_URL: string = process.env.NEXT_PUBLIC_S3_FILE_UPLOAD_URL as string;
    setLoading(true);
    const response = await axios.get(FILE_UPLOAD_URL);
    if (response?.data) {
      const uploadInfo = response.data;
      const formData = new FormData();
      // Object.keys(uploadInfo.fields).forEach((key) =>
      //   formData.append(key, uploadInfo.fields[key])
      // );
      formData.append("file", file);

      const res = await axios.put(uploadInfo.url, formData, {
        onUploadProgress,
      });
      console.log("AWS_RESPONSE", res);
      if (!!res) {
        setLoading(false);
        const link = `${response?.data?.url}/${response?.data?.fields["Key"]}`;
        return { link };
      } else {
        setLoading(false);
        // dispatchMessage(err2?.message);
        setUploadPercent(0);
        return undefined;
      }
    } else {
      setLoading(false);
      // dispatchMessage(err1?.message);
      setUploadPercent(0);
      return undefined;
    }
  };
  return {
    onUploadToS3,
    uploadPercent,
    isUploading,
  };
};

export default useFileUploadS3;
