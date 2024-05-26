/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵsetRootDomAdapter as setRootDomAdapter } from '@angular/common';
import { ɵBrowserDomAdapter as BrowserDomAdapter } from '@angular/platform-browser';
import domino from './bundled-domino';
export function setDomTypes() {
    // Make all Domino types available in the global env.
    // NB: Any changes here should also be done in `packages/platform-server/init/src/shims.ts`.
    Object.assign(globalThis, domino.impl);
    globalThis['KeyboardEvent'] = domino.impl.Event;
}
/**
 * Parses a document string to a Document object.
 */
export function parseDocument(html, url = '/') {
    let window = domino.createWindow(html, url);
    let doc = window.document;
    return doc;
}
/**
 * Serializes a document to string.
 */
export function serializeDocument(doc) {
    return doc.serialize();
}
/**
 * DOM Adapter for the server platform based on https://github.com/fgnass/domino.
 */
export class DominoAdapter extends BrowserDomAdapter {
    constructor() {
        super(...arguments);
        this.supportsDOMEvents = false;
    }
    static makeCurrent() {
        setDomTypes();
        setRootDomAdapter(new DominoAdapter());
    }
    createHtmlDocument() {
        return parseDocument('<html><head><title>fakeTitle</title></head><body></body></html>');
    }
    getDefaultDocument() {
        if (!DominoAdapter.defaultDoc) {
            DominoAdapter.defaultDoc = domino.createDocument();
        }
        return DominoAdapter.defaultDoc;
    }
    isElementNode(node) {
        return node ? node.nodeType === DominoAdapter.defaultDoc.ELEMENT_NODE : false;
    }
    isShadowRoot(node) {
        return node.shadowRoot == node;
    }
    /** @deprecated No longer being used in Ivy code. To be removed in version 14. */
    getGlobalEventTarget(doc, target) {
        if (target === 'window') {
            return doc.defaultView;
        }
        if (target === 'document') {
            return doc;
        }
        if (target === 'body') {
            return doc.body;
        }
        return null;
    }
    getBaseHref(doc) {
        // TODO(alxhub): Need relative path logic from BrowserDomAdapter here?
        return doc.documentElement.querySelector('base')?.getAttribute('href') || '';
    }
    dispatchEvent(el, evt) {
        el.dispatchEvent(evt);
        // Dispatch the event to the window also.
        const doc = el.ownerDocument || el;
        const win = doc.defaultView;
        if (win) {
            win.dispatchEvent(evt);
        }
    }
    getUserAgent() {
        return 'Fake user agent';
    }
    getCookie(name) {
        throw new Error('getCookie has not been implemented');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9taW5vX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1zZXJ2ZXIvc3JjL2RvbWlub19hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxrQkFBa0IsSUFBSSxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxrQkFBa0IsSUFBSSxpQkFBaUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBRWxGLE9BQU8sTUFBTSxNQUFNLGtCQUFrQixDQUFDO0FBRXRDLE1BQU0sVUFBVSxXQUFXO0lBQ3pCLHFEQUFxRDtJQUNyRCw0RkFBNEY7SUFDNUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLFVBQWtCLENBQUMsZUFBZSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDM0QsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FBQyxJQUFZLEVBQUUsR0FBRyxHQUFHLEdBQUc7SUFDbkQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDNUMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUMxQixPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxHQUFhO0lBQzdDLE9BQVEsR0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2xDLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxhQUFjLFNBQVEsaUJBQWlCO0lBQXBEOztRQU1vQixzQkFBaUIsR0FBRyxLQUFLLENBQUM7SUEwRDlDLENBQUM7SUEvREMsTUFBTSxDQUFVLFdBQVc7UUFDekIsV0FBVyxFQUFFLENBQUM7UUFDZCxpQkFBaUIsQ0FBQyxJQUFJLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUtRLGtCQUFrQjtRQUN6QixPQUFPLGFBQWEsQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFUSxrQkFBa0I7UUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM5QixhQUFhLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNyRCxDQUFDO1FBQ0QsT0FBTyxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFUSxhQUFhLENBQUMsSUFBUztRQUM5QixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxhQUFhLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2hGLENBQUM7SUFDUSxZQUFZLENBQUMsSUFBUztRQUM3QixPQUFPLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxpRkFBaUY7SUFDeEUsb0JBQW9CLENBQUMsR0FBYSxFQUFFLE1BQWM7UUFDekQsSUFBSSxNQUFNLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDeEIsT0FBTyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUMxQixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFDRCxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUN0QixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDbEIsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVRLFdBQVcsQ0FBQyxHQUFhO1FBQ2hDLHNFQUFzRTtRQUN0RSxPQUFPLEdBQUcsQ0FBQyxlQUFnQixDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hGLENBQUM7SUFFUSxhQUFhLENBQUMsRUFBUSxFQUFFLEdBQVE7UUFDdkMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV0Qix5Q0FBeUM7UUFDekMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7UUFDbkMsTUFBTSxHQUFHLEdBQUksR0FBVyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ1IsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUVRLFlBQVk7UUFDbkIsT0FBTyxpQkFBaUIsQ0FBQztJQUMzQixDQUFDO0lBRVEsU0FBUyxDQUFDLElBQVk7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge8m1c2V0Um9vdERvbUFkYXB0ZXIgYXMgc2V0Um9vdERvbUFkYXB0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge8m1QnJvd3NlckRvbUFkYXB0ZXIgYXMgQnJvd3NlckRvbUFkYXB0ZXJ9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgZG9taW5vIGZyb20gJy4vYnVuZGxlZC1kb21pbm8nO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0RG9tVHlwZXMoKSB7XG4gIC8vIE1ha2UgYWxsIERvbWlubyB0eXBlcyBhdmFpbGFibGUgaW4gdGhlIGdsb2JhbCBlbnYuXG4gIC8vIE5COiBBbnkgY2hhbmdlcyBoZXJlIHNob3VsZCBhbHNvIGJlIGRvbmUgaW4gYHBhY2thZ2VzL3BsYXRmb3JtLXNlcnZlci9pbml0L3NyYy9zaGltcy50c2AuXG4gIE9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgZG9taW5vLmltcGwpO1xuICAoZ2xvYmFsVGhpcyBhcyBhbnkpWydLZXlib2FyZEV2ZW50J10gPSBkb21pbm8uaW1wbC5FdmVudDtcbn1cblxuLyoqXG4gKiBQYXJzZXMgYSBkb2N1bWVudCBzdHJpbmcgdG8gYSBEb2N1bWVudCBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZURvY3VtZW50KGh0bWw6IHN0cmluZywgdXJsID0gJy8nKSB7XG4gIGxldCB3aW5kb3cgPSBkb21pbm8uY3JlYXRlV2luZG93KGh0bWwsIHVybCk7XG4gIGxldCBkb2MgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gIHJldHVybiBkb2M7XG59XG5cbi8qKlxuICogU2VyaWFsaXplcyBhIGRvY3VtZW50IHRvIHN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZURvY3VtZW50KGRvYzogRG9jdW1lbnQpOiBzdHJpbmcge1xuICByZXR1cm4gKGRvYyBhcyBhbnkpLnNlcmlhbGl6ZSgpO1xufVxuXG4vKipcbiAqIERPTSBBZGFwdGVyIGZvciB0aGUgc2VydmVyIHBsYXRmb3JtIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9mZ25hc3MvZG9taW5vLlxuICovXG5leHBvcnQgY2xhc3MgRG9taW5vQWRhcHRlciBleHRlbmRzIEJyb3dzZXJEb21BZGFwdGVyIHtcbiAgc3RhdGljIG92ZXJyaWRlIG1ha2VDdXJyZW50KCkge1xuICAgIHNldERvbVR5cGVzKCk7XG4gICAgc2V0Um9vdERvbUFkYXB0ZXIobmV3IERvbWlub0FkYXB0ZXIoKSk7XG4gIH1cblxuICBvdmVycmlkZSByZWFkb25seSBzdXBwb3J0c0RPTUV2ZW50cyA9IGZhbHNlO1xuICBwcml2YXRlIHN0YXRpYyBkZWZhdWx0RG9jOiBEb2N1bWVudDtcblxuICBvdmVycmlkZSBjcmVhdGVIdG1sRG9jdW1lbnQoKTogRG9jdW1lbnQge1xuICAgIHJldHVybiBwYXJzZURvY3VtZW50KCc8aHRtbD48aGVhZD48dGl0bGU+ZmFrZVRpdGxlPC90aXRsZT48L2hlYWQ+PGJvZHk+PC9ib2R5PjwvaHRtbD4nKTtcbiAgfVxuXG4gIG92ZXJyaWRlIGdldERlZmF1bHREb2N1bWVudCgpOiBEb2N1bWVudCB7XG4gICAgaWYgKCFEb21pbm9BZGFwdGVyLmRlZmF1bHREb2MpIHtcbiAgICAgIERvbWlub0FkYXB0ZXIuZGVmYXVsdERvYyA9IGRvbWluby5jcmVhdGVEb2N1bWVudCgpO1xuICAgIH1cbiAgICByZXR1cm4gRG9taW5vQWRhcHRlci5kZWZhdWx0RG9jO1xuICB9XG5cbiAgb3ZlcnJpZGUgaXNFbGVtZW50Tm9kZShub2RlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbm9kZSA/IG5vZGUubm9kZVR5cGUgPT09IERvbWlub0FkYXB0ZXIuZGVmYXVsdERvYy5FTEVNRU5UX05PREUgOiBmYWxzZTtcbiAgfVxuICBvdmVycmlkZSBpc1NoYWRvd1Jvb3Qobm9kZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG5vZGUuc2hhZG93Um9vdCA9PSBub2RlO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkIGluIEl2eSBjb2RlLiBUbyBiZSByZW1vdmVkIGluIHZlcnNpb24gMTQuICovXG4gIG92ZXJyaWRlIGdldEdsb2JhbEV2ZW50VGFyZ2V0KGRvYzogRG9jdW1lbnQsIHRhcmdldDogc3RyaW5nKTogRXZlbnRUYXJnZXR8bnVsbCB7XG4gICAgaWYgKHRhcmdldCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgIHJldHVybiBkb2MuZGVmYXVsdFZpZXc7XG4gICAgfVxuICAgIGlmICh0YXJnZXQgPT09ICdkb2N1bWVudCcpIHtcbiAgICAgIHJldHVybiBkb2M7XG4gICAgfVxuICAgIGlmICh0YXJnZXQgPT09ICdib2R5Jykge1xuICAgICAgcmV0dXJuIGRvYy5ib2R5O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG92ZXJyaWRlIGdldEJhc2VIcmVmKGRvYzogRG9jdW1lbnQpOiBzdHJpbmcge1xuICAgIC8vIFRPRE8oYWx4aHViKTogTmVlZCByZWxhdGl2ZSBwYXRoIGxvZ2ljIGZyb20gQnJvd3NlckRvbUFkYXB0ZXIgaGVyZT9cbiAgICByZXR1cm4gZG9jLmRvY3VtZW50RWxlbWVudCEucXVlcnlTZWxlY3RvcignYmFzZScpPy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB8fCAnJztcbiAgfVxuXG4gIG92ZXJyaWRlIGRpc3BhdGNoRXZlbnQoZWw6IE5vZGUsIGV2dDogYW55KSB7XG4gICAgZWwuZGlzcGF0Y2hFdmVudChldnQpO1xuXG4gICAgLy8gRGlzcGF0Y2ggdGhlIGV2ZW50IHRvIHRoZSB3aW5kb3cgYWxzby5cbiAgICBjb25zdCBkb2MgPSBlbC5vd25lckRvY3VtZW50IHx8IGVsO1xuICAgIGNvbnN0IHdpbiA9IChkb2MgYXMgYW55KS5kZWZhdWx0VmlldztcbiAgICBpZiAod2luKSB7XG4gICAgICB3aW4uZGlzcGF0Y2hFdmVudChldnQpO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIGdldFVzZXJBZ2VudCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnRmFrZSB1c2VyIGFnZW50JztcbiAgfVxuXG4gIG92ZXJyaWRlIGdldENvb2tpZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHRocm93IG5ldyBFcnJvcignZ2V0Q29va2llIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG59XG4iXX0=