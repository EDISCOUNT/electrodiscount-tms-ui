import { useConfigStore } from "@/store/app";
export function resolveFileURL(id: string) {
    const { url } = useConfigStore();
    return url(`/file/${id}`);
}