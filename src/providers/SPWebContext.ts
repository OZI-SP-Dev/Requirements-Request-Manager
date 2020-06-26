import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web, IWeb } from '@pnp/sp/webs';
import "@pnp/sp/lists";
import "@pnp/sp/items";

export const spWebContext: IWeb = Web(process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "").configure({
  headers: { "Accept": "application/json; odata=verbose" }
});