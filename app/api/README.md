# ZipLink API

![Picture](https://fabric.inc/wp-content/uploads/2022/02/170220221645089456.jpeg)

Create a meeting with a `HTTP GET request` containing the URL to be shortened and `(or)` alias. The response contains a `shortened URL` that can be used to go to the original URL.

### Shorten A URL

```bash
curl -X 'GET' 'https://ziplink.cleverapps.io/api/shorten?url=https://google.com/' -H 'accept: application/json'
```
This produces a shortened URL, with a random alias, by a GET request to ZipLink.


### Shorten A URL WITH CUSTOMIZED ALIAS

```bash
curl -X 'GET' 'https://ziplink.cleverapps.io/api/shorten?url=https://google.com/&alias=google' -H 'accept: application/json'
```
This produces a shortened URL, with a custom alias (in this case <code>google</code>), by a GET request to ZipLink.


Moreover, you can check out the API documentation <a href="https://ziplink.cleverapps.io/api/docs">live here</a> (Swagger).
