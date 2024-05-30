// import React, { ChangeEvent, useState } from "react";
// import { useFieldArray, Controller } from "react-hook-form";
// import Image from "next/image";
// import { Upload } from "lucide-react";

// const ImageUploader = ({ control, name }: any) => {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name,
//   });
//   const [previews, setPreviews] = useState<any>([]);

//   const handleImageUpload = (
//     index: number,
//     e: ChangeEvent<HTMLInputElement>
//   ) => {
//     if (!e?.target?.files) return;
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//       const dataURL = reader.result;
//       const newValues = [...fields];
//       // newValues[index]["productImages"] = dataURL;
//       append(newValues);
//       setPreviews([...previews, { id: index, image: dataURL }]);
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleRemovePreview = (index: number) => {
//     const updatedPreviews = previews.filter((item: any) => item.id !== index);
//     setPreviews(updatedPreviews);
//     remove(index);
//   };

//   return (
//     <div className="grid gap-2">
//       {previews.map((preview: any) => (
//         <div key={preview.id}>
//           <button onClick={() => handleRemovePreview(preview.id)}>
//             <Image
//               alt="Product image"
//               className="aspect-square w-full rounded-md object-cover"
//               height="84"
//               src={preview.image}
//               width="84"
//             />
//           </button>
//         </div>
//       ))}
//       <div className="grid grid-cols-3 gap-2">
//         {fields.map((product, index) => (
//           <div key={index}>
//             <button>
//               <Image
//                 alt="Product image"
//                 className="aspect-square w-full rounded-md object-cover"
//                 height="84"
//                 src={product.productImages}
//                 width="84"
//               />
//             </button>
//           </div>
//         ))}
//         <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
//           <Upload className="h-4 w-4 text-muted-foreground" />
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) =>
//               handleImageUpload(fields.length + previews.length, e)
//             }
//           />
//           <span className="sr-only">Upload</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;
