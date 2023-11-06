import '@logseq/libs';
import { PageEntity } from '@logseq/libs/dist/LSPlugin.user';

async function getFilenamePrefix(currentPage:PageEntity|null):Promise<string|null>{

      if(currentPage == null) {
        return null;
      }
      // find the namespace
      const pageName = currentPage.name;
      // this/isthe/namespace/filename
      let namespace = "";
      const parts = pageName.split("/");
      if(parts.length > 1) {
        parts.pop();
        namespace = parts.join("/");
        namespace = namespace.trim() + "/";
      }
      namespace = namespace.trim();

      return namespace;
}

async function main() {
  logseq.Editor.registerSlashCommand(
    "Page reference in Namespace",
    async (e) => {
      const block = await logseq.Editor.getBlock(e.uuid);
      if(block?.page?.id == null) {
        return;
      }
      const currentPage = await logseq.Editor.getPage(block.page.id);
      let prefix = await getFilenamePrefix(currentPage);
      if(prefix == null) {
        return;
      }

      const pageRef = `[[${prefix}]]`;

      // insert the page reference
      await logseq.Editor.insertAtEditingCursor(pageRef);

      // move the cursor inside the page reference
      const input = parent.document.activeElement as HTMLInputElement;
      if(input?.selectionStart == null) {
        return;
      }
      const pos = input.selectionStart - 2
      input.setSelectionRange(pos, pos)
    });

    logseq.Editor.registerSlashCommand("Page embed in Namespace",
    async (e) => {
      const block = await logseq.Editor.getBlock(e.uuid);
      if(block?.page?.id == null) {
        return;
      }
      const page = await logseq.Editor.getPage(block.page.id);
      const prefix = await getFilenamePrefix(page);
      if(prefix == null) {
        return;
      }

      const pageRef = `{{embed [[${prefix}]]}}`;

      // insert the page reference
      await logseq.Editor.insertAtEditingCursor(pageRef);

      // move the cursor inside the page reference
      const input = parent.document.activeElement as HTMLInputElement;
      if(input?.selectionStart == null) {
        return;
      }
      const pos = input.selectionStart - 4
      input.setSelectionRange(pos, pos)
    });

}
logseq.ready(main).catch(console.error);
