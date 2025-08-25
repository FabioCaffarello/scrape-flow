import { ScrollToElementTask } from "@/lib/workflow/task/ScrollToElement";
import { ExecutionEnvironment } from "@/types/executor";


export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>,
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->selector not defined");
      return false;
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error("element not found");
      }
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    }, selector)
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
