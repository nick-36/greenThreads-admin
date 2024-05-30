import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export function formatDateString(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
  }
) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  // const time = date.toLocaleTimeString([], {
  //   hour: "numeric",
  //   minute: "2-digit",
  // });

  return `${formattedDate}`;
}

export function generateProductVariations(variationsData: any) {
  const generateCombinations = (
    currentVariationIndex: number,
    currentCombination: any,
    combinations: any
  ) => {
    if (currentVariationIndex === variationsData.length) {
      if (Object.keys(currentCombination).length > 0) {
        combinations.push({ ...currentCombination, availableStock: 0 });
      }
      return;
    }

    const variation = variationsData[currentVariationIndex];

    variation.variationOptions.forEach((option: any) => {
      const updatedCombination = { ...currentCombination };
      updatedCombination[variation.variantName.toLowerCase()] = option.name;

      generateCombinations(
        currentVariationIndex + 1,
        updatedCombination,
        combinations
      );
    });
  };

  const combinations: any = [];
  generateCombinations(0, {}, combinations);
  return combinations;
}

export const generateColumns = (variationsData: any) => {
  const columns: any = [];

  // Extract all unique variation types
  const variationTypes = variationsData.reduce((types: any, variation: any) => {
    Object.keys(variation).forEach((key) => {
      if (!types.includes(key)) {
        types.push(key);
      }
    });
    return types;
  }, []);

  // Generate column objects for each variation type
  variationTypes.forEach((type: any) => {
    columns.push({
      id: type,
      accessorKey: type,
      header: type.charAt(0).toUpperCase() + type.slice(1),
    });
  });

  return columns;
};

export const formatVariationData = (data: any) => {
  // Initialize an empty array to store the transformed data
  const result: any = [];

  // Iterate over each object in the input array
  data.forEach((item: any) => {
    // Initialize an empty array to store options
    const options: any = [];

    // Iterate over each variation option
    item.variationOptions.forEach((option: any) => {
      // Push the option details to the options array
      options.push({
        name: option.name,
        id: option.id,
      });
    });

    // Push the key-value pair to the result array
    result.push({
      id: item.id,  
      variantName: item.variantName,
      variantId: item.variantId,
      variationOptions: options,
    });
  });

  return result;
};

export const formatCombinations = (combinations: any) => {
  return combinations.map((combination: any) => {
    const formattedCombination = { ...combination };
    const { variationDetails } = formattedCombination;

    // Remove the variationDetails field
    delete formattedCombination.variationDetails;

    // Move each field from variationDetails to the parent level
    for (const key in variationDetails) {
      formattedCombination[key] = variationDetails[key];
    }

    return formattedCombination;
  });
};
