import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/shared/Table/Table";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";


interface ProductCombinationsProps {
  isDisabled?: boolean;
}

interface Column {
  id: string;
  accessorKey: string;
  header: string;
  cell?: React.FC<CellProps>;
}

interface CellProps {
  table: any;
  row: {
    original: any;
    index: number;
    id: string;
  };
  column: { id: string };
}

const ProductCombinations: React.FC<ProductCombinationsProps> = ({
  isDisabled = false,
}) => {
  const form = useFormContext();
  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "combinations",
  });
  const combinations = form.getValues("combinations");

  const EditableCell: React.FC<CellProps> = ({
    table,
    row: { index, id: rowId },
    column: { id },
  }) => {
    const { getValues, setValue: formSetValue } = useFormContext();
    const formValue = getValues(`combinations.${rowId}.availableStock`);

    const [value, setValue] = useState(formValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(Number(e.target.value));
    };

    const onBlur = (field: any) => {
      table.options.meta?.updateData(index, id, value);
      field.onChange(value);
    };

    useEffect(() => {
      setValue(formValue);
    }, [formValue]);

    return (
      <FormField
        name={`combinations.${rowId}.availableStock`}
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-1 md:max-w-28">
            <FormLabel
              htmlFor={`combinations.${rowId}.availableStock`}
              className="sr-only"
            >
              stock
            </FormLabel>
            <FormControl>
              <Input
                id={`combinations.${rowId}.availableStock`}
                // type="number"
                onChange={handleChange}
                defaultValue={formValue}
                onBlur={() => onBlur(field)}
                value={value}
                disabled={isDisabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    );
  };

  const generateColumns = ({ baseColumns, dynamicColums }: any): Column[] => {
    const defaultColumn = (type: string) => ({
      id: type,
      accessorKey: type,
      header: type.charAt(0).toUpperCase() + type.slice(1),
    });
    const columns: Column[] = [];
    const encounteredIds: Set<string> = new Set();

    // Check if the 'id' column exists and add it as the first column
    const idIndex = variationTypes.indexOf("id");
    if (idIndex !== -1) {
      columns.push({
        ...defaultColumn("id"),
        cell: ({ row }) => {
          const { id } = row?.original;
          return <p>{id?.replace(/-/g, "").substring(0, 6)}</p>;
        },
      });
      // Add 'id' to encounteredIds
      encounteredIds.add("id");
      // Remove 'id' from variationTypes
      variationTypes.splice(idIndex, 1);
    }

    dynamicColums.forEach((type: string) => {
      columns.push({ ...defaultColumn(type.toLowerCase()) });
    });

    // Generate columns for other variation types
    baseColumns.forEach((type: string) => {
      if (!encounteredIds.has(type)) {
        switch (type) {
          case "availableStock":
            columns.push({ ...defaultColumn(type), cell: EditableCell });
            break;
          case "action":
            const removeRow = (row: any, table: any) => {
              remove(row.index);
              table.options.meta?.removeRow(row.index);
            };
            columns.push({
              ...defaultColumn(type),
              cell: ({ row, table }) => (
                <Button
                  variant={"ghost"}
                  disabled={fields.length === 1 || isDisabled}
                  onClick={() => removeRow(row, table)}
                >
                  <Trash2 />
                </Button>
              ),
            });
            break;
          default:
            <></>;
        }
        // Add the column id to encounteredIds
        encounteredIds.add(type);
      }
    });
    return columns;
  };

  // const variationTypes = Object.keys(combinations?.[0] ?? {});
  const variationTypes = form.getValues("variations").map((item: any) => {
    return item.variantName;
  });
  const columns = generateColumns({
    dynamicColums: variationTypes,
    baseColumns: ["availableStock", "action"],
  });

  console.log(columns,combinations, "COLUMNS");

  return (
    <div className="overflow-x-hidden">
      <DataTable columns={columns} data={combinations} showPagination={false} />
    </div>
  );
};

export default ProductCombinations;
