# Configuration

| Name            | Description                                                                           | Environment variable                    | Configuration variable                                             | Default value                                                            |
| --------------- | ------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Listening Port  | Port where the server will start to listen.                                           | `PORT`                                  | `port: number`                                                     | `2000`                                                                   |
| Server address  | Address of the server                                                                 | `SERVER_ADDRESS`                        | `serverAddress: string`                                            | null                                                                     |
| CORS support    | Enable Cross Origin Resource Sharing                                                  | `CROSS_ORIGIN_DOMAINS` separated by `,` | `crossOriginDomains: { enabled: boolean; domains: string[] }`      | `null`                                                                   |
| XSRF validation | Automatic XSRF validation against `XSRF-TOKEN` cookie and `X-XSRF-TOKEN` header value | -                                       | `xsrfValidation: { diabled?: boolean; excludeRoutes?: RegExp[]; }` | `{ disabled: false, excludeRoutes: [/^\/api\/settings\/xsrf-token$/], }` |

#### Continue reading: [ Controllers >>](/core/controllers.md) <!-- {docsify-ignore} -->
