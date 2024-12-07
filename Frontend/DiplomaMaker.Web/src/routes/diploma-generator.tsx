import { DiplomaGenerator } from "@/features/diploma-generator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/diploma-generator")({
  component: DiplomaGenerator,
});
