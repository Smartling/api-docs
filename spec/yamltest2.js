import { Resolver } from "@stoplight/json-ref-resolver";

// some example http library
import * as axios from "axios";
import * as yaml from "js-yaml";

// if we're in node, we create a file resolver with fs
import * as fs from "fs";

const doc = yaml.load(fs.readFileSync('./spec/example1.yml', 'utf8'));
console.log(doc);

// create our resolver instance
const resolver = new Resolver({
    // resolvers can do anything, so long as they define an async read function that resolves to a value
    resolvers: {
        // this resolver will be invoked for refs with the https protocol
        https: {
            async resolve(ref: uri.URI) {
                return axios({
                    method: "get",
                    url: String(ref)
                });
            }
        },

        // this resolver will be invoked for refs with the file protocol
        file: {
            async resolve(ref: uri.URI) {
                return fs.read(String(ref));
            }
        }
    }
});

const resolved = await resolver.resolve(doc);
console.log(resolved.result);

// ==> result is the original object, with refs resolved and replaced
// expect(resolved.result).toEqual({
//     definitions: {
//         someOASFile: {
//             // ... the data located in the relative file `./main.oas2.yml` and inner json path `#/definitions/user`
//         },
//         someMarkdownFile: {
//             // ... the data located at the url `https://foo.com/intro.md`
//         }
//     }
// });