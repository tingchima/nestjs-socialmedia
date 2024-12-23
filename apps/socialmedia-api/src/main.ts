import "module-alias/register";
import { Application } from "@application/application";

(async (): Promise<void> => {
  await runApplication().catch((error) => {
    console.error(error);
  });
})();

async function runApplication(): Promise<void> {
  const app: Application = Application.new();
  await app.run();
}
