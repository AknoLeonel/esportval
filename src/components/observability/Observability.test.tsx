import { render } from "@testing-library/react";
import { expect, it, vi } from "vitest";

const initClientObservability = vi.fn();
vi.mock("@/lib/observability/client", () => ({ initClientObservability }));

it("liga os provedores do navegador ao montar e não renderiza nada", async () => {
  const { Observability } = await import("./Observability");
  const { container } = render(<Observability />);
  expect(initClientObservability).toHaveBeenCalledOnce();
  expect(container).toBeEmptyDOMElement();
});
