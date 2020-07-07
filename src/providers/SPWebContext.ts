import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/site-users/web";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import { IWeb, Web } from '@pnp/sp/webs';

export const spWebContext: IWeb = Web(process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "").configure({
  headers: { "Accept": "application/json; odata=verbose" }
});