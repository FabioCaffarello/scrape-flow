import { AddPropertyToJsonTask } from "@/lib/workflow/task/AddPropertyToJson";
import { ExecutionEnvironment } from "@/types/executor";


export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>,
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input->JSON not defined");
      return false;
    }

    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("input->Property name not defined");
      return false;
    }

    const propertyValue = environment.getInput("Property value");
    if (!propertyValue) {
      environment.log.error("input->Property value not defined");
      return false;
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;

    environment.setOutput("Updated JSON", JSON.stringify(json));

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
