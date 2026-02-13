import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createTask } from "@/features/dashboard/api";
import { type TaskCreate, type WorkflowType } from "@/features/dashboard/types";
import { useForm } from "react-hook-form";
import { handleTaskCreate } from "@/realtime/eventHandler";


export function FormCard() {
  const form = useForm<TaskCreate>({
    defaultValues: {
      customer_name: "",
      phone_number: "",
      workflow: "support" as WorkflowType,
    },
  });

  const onSubmit = async (data: TaskCreate) => {

    const task: TaskCreate = {
      customer_name: data.customer_name,
      phone_number: data.phone_number,
      workflow: data.workflow,
    };
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
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
          <Input
            {...form.register("phone_number")}
            id="form-phone"
            type="tel"
            placeholder=" 1234567890"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-process">Workflow</FieldLabel>
          <Select
            onValueChange={(value) =>
              form.setValue("workflow", value as WorkflowType)
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
