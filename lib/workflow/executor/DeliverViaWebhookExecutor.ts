import { DeliverViaWebhookTask } from "@/lib/workflow/task/DeliverViaWebhook";
import { ExecutionEnvironment } from "@/types/executor";


export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>,
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("input->targetUrl not defined");
      return false;
    }

    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input->body not defined");
      return false;
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`status code: ${statusCode}`);
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(`Webhook delivery succeeded: ${JSON.stringify(responseBody, null, 4)}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
