import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

import { createTask } from "@/features/dashboard/api";
import { taskCreateSchema } from "@/features/dashboard/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleTaskCreate } from "@/realtime/eventHandler";


export function FormCard() {
  const form = useForm<z.infer<typeof taskCreateSchema>>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      customer_name: "",
      phone_number: "",
      workflow: "support",
    },
  });

  const onSubmit = async (data: z.infer<typeof taskCreateSchema>) => {

    const task = data;
    try {
      const newTask = await createTask(task);
      handleTaskCreate(newTask);
      form.reset();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form className="w-full max-w-sm" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name">Name</FieldLabel>
          <Input
            {...form.register("customer_name")}
            id="form-name"
            type="text"
            placeholder="Evil Rabbit"
          />
          <FieldError>
            {form.formState.errors.customer_name?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
          <Input
            {...form.register("phone_number")}
            id="form-phone"
            type="tel"
            placeholder=" 1234567890"
          />
          <FieldError>
            {form.formState.errors.phone_number?.message}
          </FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="form-process">Workflow</FieldLabel>
          <Select
            onValueChange={(value) =>
              form.setValue("workflow", value as "support" | "sales" | "reminder")
            }
          >
            <SelectTrigger id="form-process">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field orientation="horizontal">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
