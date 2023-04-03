# <i><p align="center">ZipLink</p></i>


<div align="center">
  <p align="center">
    Shorten URLs with ease, powered by MongoDB
    <br />
    <hr>
    <a href="https://ziplink.cleverapps.io/"><b>Try Demo</b></a>
    <hr>
  </p>
</div>

<p align="center">
    <img src="public/images/preview.png">
</p>

<p align="center">
    <a href="https://jeherillajanwar.github.io/"><img src="https://img.shields.io/badge/Dev-Ishaan%20Sharma-brightgreen.svg"></img></a>
    <a href="https://choosealicense.com/licenses/bsd-3-clause/"><img src="https://img.shields.io/badge/LICENSE-BSD_3_Clause%20%22New%22%20or%20%22Revised%22%20License-blue.svg"></img></a>
    <a href="mailto:askishaan.sh@gmail.com"><img src="https://img.shields.io/badge/CONTACT_DEV-EMAIL-red"></img></a>
    
</p>

---

<details open>
<summary>Quick start</summary>

<br/>

-   You will need to have `Node.js` installed, this project has been tested with Node versions [12.X](https://nodejs.org/en/blog/release/v12.22.1/), [14.X](https://nodejs.org/en/blog/release/v14.17.5/) and [16.X](https://nodejs.org/en/blog/release/v16.15.0/).

```bash
# clone this repo
$ git clone https://github.com/JeherillaJanwar/ZipLink.git
# go to ZipLink dir
$ cd ZipLink
# copy .env.template to .env (edit it according to your needs)
$ cp .env.template .env
```

Now, go to `.env` file and change the MONGO URL & DATABASE, with your own:

```bash
mongo_url = mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}
DB = ZipLink # Database Name
```


```bash
# Install dependencies
$ npm install
# Start the server
$ npm start
```

-   Open http://localhost:8080 in your DEFAULT browser


</details>


<details>
<summary>API</summary>

##### Shorten A URL

```bash
curl -X 'GET' 'https://ziplink.cleverapps.io/api/shorten?url=https://google.com/' -H 'accept: application/json'
```
This produces a shortened URL, with a random alias, by a GET request to ZipLink.


##### Shorten A URL WITH CUSTOMIZED ALIAS

```bash
curl -X 'GET' 'https://ziplink.cleverapps.io/api/shorten?url=https://google.com/&alias=google' -H 'accept: application/json'
```
This produces a shortened URL, with a custom alias (in this case <code>google</code>), by a GET request to ZipLink.


Moreover, you can check out the API documentation <a href="https://ziplink.cleverapps.io/api/docs">live here</a> (Swagger).
</details>

<details>
<summary>Self Hosting</summary>
<br>
To self-host ZipLink, just follow <a href="https://github.com/JeherillaJanwar/ZipLink/blob/main/docs/self_hosting.md">these steps</a>.

</details>

<details>
<summary>Live Demos</summary>
<a href="https://ziplink.cleverapps.io/">https://ziplink.cleverapps.io/</a>
<a href="https://ziplink.cleverapps.io/"><img src="../images/qr.png" /></a>
</details>

<details>
<summary>License</summary>

```text
BSD 3-Clause License

Copyright (c) 2023, Ishaan S.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

</details>
<br>
<h3 align="left">Support:</h3>
<p><a href="https://www.buymeacoffee.com/ishaan328069"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="ishaan328069" /></a></p>
