import { useEffect, useRef } from "react";

import { PdfMeTypes, TemplateTypes } from "@/services";

import { usePdfMeViewer } from "./usePdfMeViewer";

interface Props {
  template: PdfMeTypes.Template;
  substitions: TemplateTypes.Substitions;
  className?: string;
}

export default function PreviewDiplomaViewer({
  template,
  substitions,
  className,
}: Props) {
  const diplomaViewerRef = useRef<HTMLDivElement | null>(null);
  const { loadViewer } = usePdfMeViewer();

  useEffect(() => {
    if (diplomaViewerRef.current) {
      loadViewer(diplomaViewerRef.current, template, substitions);
    }
  }, [diplomaViewerRef, template, substitions, loadViewer]);

  return <div ref={diplomaViewerRef} className={className} />;
}
