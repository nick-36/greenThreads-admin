import React, { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import MultiSelect from "../ui/MultiSelect";
import { useFieldArray } from "react-hook-form";
import { PlusCircle, Trash2 } from "lucide-react";
import axios from "@/lib/utils/axios";
import { toast } from "../ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "../ui/icons";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

type VariationType = { label: string; value: string };

const fetchVariations = async () => {
  try {
    const response = await axios.get("/products/variations");
    return response?.data;
  } catch (error: any) {
    toast({
      title: `Uh oh! `,
      description: "Failed To Fetch Variations!!",
    });
  }
};

const VariantForm = () => {
  const form = useFormContext();
  const params = useParams();
  const isAddVariationDisabled = params?.id ? true : false;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variations",
  });
  const { data: variations = [], isLoading: isLoading } = useQuery({
    queryKey: ["variations"],
    queryFn: fetchVariations,
  });

  const watchVariantType = (variantIndex: number) =>
    form.watch(`variations.${variantIndex}.variantId`);

  const handleAddVariant = () => {
    append({ variantName: "", variantId: null, variationOptions: [] });
  };
  const handleRemoveVariant = (variantIndex: number) => {
    if (variantIndex == 0) return;
    remove(variantIndex);
  };

  const variationTypes: VariationType[] = useMemo(() => {
    if (!variations.length) return [];
    return variations.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [variations]);

  const formatVariatonOption = (options: any[]) => {
    const labelValuePairs = options?.map((opt: any) => {
      return {
        label: opt.name ?? opt.label,
        value: opt.id ?? opt.value,
      };
    });
    return labelValuePairs;
  };

  const variationOptionMap = useMemo(() => {
    return variations.reduce((acc: any, item: any) => {
      acc[item.id] = formatVariatonOption(item.variationOptions);
      return acc;
    }, {});
  }, [variations]);

  const getSelectedVariationOptions = useCallback((variantId: string) => {
    const variant = fields.find(
      (item: any) => item.variantId === variantId
    ) as any;
    const labelValuePair = formatVariatonOption(variant?.variationOptions);
    return labelValuePair;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button
          size="sm"
          className="h-8 gap-1 max-w-40"
          onClick={handleAddVariant}
          type="button"
          disabled={isAddVariationDisabled}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Variation
          </span>
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {fields.map((variant, variantIndex) => {
          return (
            <>
              <FormField
                control={form.control}
                name={`variations.${variantIndex}.variantName`}
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-4 md:col-span-1">
                      <FormLabel htmlFor="variantType" className="sr-only">
                        Variant Type
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={field.value}
                          onValueChange={(val) => {
                            const variant: any = variationTypes.find(
                              (item: any) => item.label === val
                            );
                            if (variant) {
                              field.onChange(val);
                              form.setValue(
                                `variations.${variantIndex}.variantId`,
                                variant.value
                              );
                            }
                          }}
                          {...field}
                        >
                          <SelectTrigger
                            id={`variations.${variantIndex}.variantName`}
                            aria-label="Select Variant"
                          >
                            {isLoading && (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <SelectValue placeholder="Select Variant" />
                          </SelectTrigger>
                          <SelectContent>
                            {variationTypes?.map((item, idx: number) => {
                              return (
                                <SelectItem
                                  disabled={fields?.some((opt: any) => {
                                    return item.value === opt.variantId;
                                  })}
                                  key={idx}
                                  value={item?.label}
                                >
                                  {item?.label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {watchVariantType(variantIndex) && (
                <FormField
                  name={`variations.${variantIndex}.variationOptions`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="relative col-span-4 md:col-span-2 h-fit">
                      <FormLabel htmlFor="variationOptions" className="sr-only">
                        Select Variant Options
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={
                            variationOptionMap[watchVariantType(variantIndex)]
                          }
                          placeholder=""
                          onChange={(selectedValue) => {
                            const nameIdPair = selectedValue?.map((item) => {
                              return {
                                name: item.label,
                                id: item.value,
                              };
                            });
                            field.onChange(nameIdPair);
                          }}
                          selectedValues={getSelectedVariationOptions(
                            watchVariantType(variantIndex)
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className={cn("flex items-center")}>
                <Button
                  type="button"
                  size={"icon"}
                  variant={"ghost"}
                  className= {cn("h-full",isAddVariationDisabled && 'hidden')}
                  onClick={() => handleRemoveVariant(variantIndex)}
                >
                  <Trash2 />
                </Button>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default VariantForm;
