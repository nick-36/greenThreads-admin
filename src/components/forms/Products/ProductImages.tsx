"use client";

import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { UploadDropzone } from "@/lib/utils/uploadthing";

const ProductImage = () => {
  const form = useFormContext();
  const productImages = form.getValues("productImages");
  const { toast } = useToast();

  // const onDrop = useCallback(async (acceptedFiles: File[]) => {
  //   if (acceptedFiles?.length) {
  //     const newFiles = productImages.map((file: File) => [
  //       ...productImages,
  //       file,
  //     ]);
  //     console.log(newFiles, "FILES");
  //     form.setValue("productImages", newFiles);
  //   }
  // }, []);

  const removeFile = (name: string) => {
    const newFiles = productImages.filter((file: any) => file.name !== name);
    form.setValue("productImages", newFiles);
  };

  return (
    <>
      <section className="h-full p-2 w-full flex flex-col">
        <UploadDropzone
          // className="bg-slate-800 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
          endpoint="multiImageUploader"
          onClientUploadComplete={(data) => {
            console.log("Files: ", data);
            const newFiles = [...productImages, ...data];
            form.setValue("productImages", newFiles);
            toast({
              title: "Uploaded Successfully!",
            });
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            console.log(error, "EROR");
            toast({
              title: "Something Went Wrong,Try Again!",
            });
          }}
        />
        <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
          Uploaded
        </h3>
        <ul id="gallery" className="flex flex-1 flex-wrap  pt-4">
          {productImages.map((file: any, index: number) => {
            return (
              <li
                className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24"
                key={index}
              >
                <article className="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline cursor-pointer relative text-transparent hover:text-white shadow-sm ">
                  <Image
                    src={file.preview ?? file.url}
                    alt={file.name}
                    width={100}
                    height={100}
                    className="img-preview w-full h-full sticky object-contain rounded-md bg-fixed"
                  />

                  <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3 hover:bg-black opacity-70 hover:backdrop-blur-md">
                    <h1 className="flex-1">{file.name?.substring(0, 6)}</h1>
                    <div className="flex">
                      <span className="p-1">
                        <i>
                          <svg
                            className="fill-current w-4 h-4 ml-auto pt-"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z"></path>
                          </svg>
                        </i>
                      </span>

                      <p className="p-1 size text-xs">
                        {Math.ceil(file.size / 1000000)} MB
                      </p>
                      <button
                        className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md"
                        data-target="blob:https://tailwindcomponents.com/ed693163-710c-4f3e-a8dd-0f47edc8c14b"
                        onClick={() => removeFile(file.name)}
                      >
                        <svg
                          className="pointer-events-none fill-current w-4 h-4 ml-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            className="pointer-events-none"
                            d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </section>
                </article>
              </li>
            );
          })}

          {!productImages.length && (
            <li
              id="empty"
              className="h-full w-full text-center flex flex-col  justify-center items-center"
            >
              <img
                className="mx-auto w-32"
                src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                alt="no data"
              />
              <span className="text-small text-gray-500">
                No files selected
              </span>
            </li>
          )}
        </ul>
      </section>
    </>
  );
};

export default ProductImage;
