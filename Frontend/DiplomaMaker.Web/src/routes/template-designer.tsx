import { createFileRoute } from '@tanstack/react-router';
import TemplateDesigner from '../components/TemplateDesigner';

export const Route = createFileRoute('/template-designer')({
    component: TemplateDesigner,
});